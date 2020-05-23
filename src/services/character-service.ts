import { CharacterDB } from '../data-access'
import { MongoDBError, NotFoundError } from '../errors'
import { processFindCharacterFilter, processDeleteCharacterFilter } from '../utils'
import { ActionResult, CharQueryType, CharFilterType, ICharacter } from '../models'
import { ObjectId } from 'mongodb'

const getCharacter = async (id: ObjectId): Promise<ActionResult> => {
  const result = await CharacterDB.getCharacter(id)
  if (!result?._id) {
    return new ActionResult({}, `Get character failed: ${id}`, new NotFoundError())
  }
  return new ActionResult(result, `Get character success: ${id}`)
}

const getCharacters = async (query: CharQueryType): Promise<ActionResult> => {
  const filter: CharFilterType = processFindCharacterFilter(query)
  const result = await CharacterDB.getCharacters(filter)
  if (!result.length) {
    return new ActionResult([], 'Failed to fetch characters.', new NotFoundError())
  }
  return new ActionResult(result, 'Get characters success.')
}

const createCharacter = async (character: ICharacter): Promise<ActionResult> => {
  character.created = new Date()
  character._id = new ObjectId()
  const result = await CharacterDB.createCharacter(character)
  if (!result) {
    return new ActionResult(result, 'Create character failed.', new MongoDBError())
  }
  return new ActionResult(result, 'Create character success.')
}

const updateCharacter = async (id: ObjectId, character: ICharacter): Promise<ActionResult> => {
  delete character._id
  const result = await CharacterDB.updateCharacter(id, character)
  if (!result.nModified) {
    return new ActionResult(result, `Failed to update character: ${id}`, new NotFoundError())
  }
  return new ActionResult(result, 'Update character succes.')
}

const deleteCharacter = async (id: ObjectId): Promise<ActionResult> => {
  const result = await CharacterDB.deleteCharacter(id)
  if (!result.deletedCount) {
    return new ActionResult(result, `Failed to delete character: ${id}`, new NotFoundError())
  }
  return new ActionResult(result, `Delete character success: ${id}`)
}

const deleteCharacters = async (query: CharQueryType): Promise<ActionResult> => {
  const filter: CharFilterType = processDeleteCharacterFilter(query)
  const result = await CharacterDB.deleteCharacters(filter)
  if (!result.deletedCount) {
    return new ActionResult(result, 'Failed to delete characters.', new NotFoundError())
  }
  return new ActionResult(result, 'Delete characters success.')
}

export default {
  getCharacter,
  getCharacters,
  updateCharacter,
  createCharacter,
  deleteCharacter,
  deleteCharacters
}