import { CharacterDB } from '../data-access'
import { MongoDBError, NotFoundError } from '../errors'
import { processFindCharacterFilter, processDeleteCharacterFilter } from '../utils'
import { ActionResult, CharQueryType, ICharFilter, ICharacter } from '../models'
import { ObjectID } from 'mongodb'

const getCharacterById = async (id: ObjectID): Promise<ActionResult> => {
  const result = await CharacterDB.getCharacterById(id)
  if (!result?._id) {
    return new ActionResult({}, `Get character failed: ${id}`, new NotFoundError())
  }
  return new ActionResult(result, `Get character success: ${id}`)
}

const getCharacterByFilter = async (query: CharQueryType): Promise<ActionResult> => {
  if (!query.userName) return new ActionResult([], 'Must provide a username to retrieve characters.', new NotFoundError())
  const filter: ICharFilter = processFindCharacterFilter(query)
  const result = await CharacterDB.getCharacterByFilter(filter)
  if (!result.length) {
    return new ActionResult([], 'Failed to fetch characters.', new NotFoundError())
  }
  return new ActionResult(result, 'Get characters success.')
}

const createCharacter = async (character: ICharacter): Promise<ActionResult> => {
  character.created = new Date()
  character._id = new ObjectID()
  const result = await CharacterDB.createCharacter(character)
  if (!result) {
    return new ActionResult(result, 'Create character failed.', new MongoDBError())
  }
  return new ActionResult(result, 'Create character success.')
}

const updateCharacter = async (character: ICharacter): Promise<ActionResult> => {
  delete character._id
  const result = await CharacterDB.updateCharacter(character)
  if (!result.nModified) {
    return new ActionResult({}, `Failed to update character.`, new NotFoundError())
  }
  return new ActionResult(result, 'Update character success.')
}

const deleteCharacter = async (_id: ObjectID): Promise<ActionResult> => {
  const result = await CharacterDB.deleteCharacter(_id)
  if (!result.deletedCount) {
    return new ActionResult({}, `Failed to delete character: ${_id}`, new NotFoundError())
  }
  return new ActionResult({deleted: result.deletedCount}, `Delete character success: ${_id}`)
}

const deleteCharacters = async (query: CharQueryType): Promise<ActionResult> => {
  const filter: ICharFilter = processDeleteCharacterFilter(query)
  const result = await CharacterDB.deleteCharacters(filter)
  if (!result.deletedCount) {
    return new ActionResult({}, 'Failed to delete characters.', new NotFoundError())
  }
  return new ActionResult({deleted: result.deletedCount}, 'Delete characters success.')
}

export default {
  getCharacterById,
  getCharacterByFilter,
  updateCharacter,
  createCharacter,
  deleteCharacter,
  deleteCharacters
}