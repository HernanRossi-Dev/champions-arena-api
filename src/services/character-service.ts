import { CharacterDB } from '../data-access'
import { MongoDBError, NotFoundError } from '../errors'
import { processFindCharacterFilter } from '../utils'
import { ActionResult, CharQueryT, ICharFilter, ICharacter } from '../models'
import { ObjectID } from 'mongodb'

const getCharacterById = async (_id: ObjectID): Promise<ActionResult> => {
  const result = await CharacterDB.getCharacterById(_id)
  if (!result?._id) {
    return new ActionResult({}, `Get character failed: ${_id}.`, new NotFoundError())
  }
  return new ActionResult(result, `Get character success: ${_id}.`)
}

const getCharacterByFilter = async (query: CharQueryT): Promise<ActionResult> => {
  const filter: ICharFilter = processFindCharacterFilter(query)
  if (!filter.userName) return new ActionResult([], 'Must provide a username to retrieve characters.', new NotFoundError())
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
  const result = await CharacterDB.updateCharacter(character)
  const modifiedCount = result.nModified
  if (!modifiedCount) {
    return new ActionResult({ modifiedCount }, `Failed to update character.`, new NotFoundError())
  }
  return new ActionResult({ modifiedCount }, 'Update character success.')
}

const deleteCharacter = async (_id: ObjectID): Promise<ActionResult> => {
  const result = await CharacterDB.deleteCharacter(_id)
  const { deletedCount } = result
  if (!deletedCount) {
    return new ActionResult({ deletedCount }, `Failed to delete character: ${_id}`, new NotFoundError())
  }
  return new ActionResult({ deletedCount }, `Delete character success: ${_id}`)
}

const deleteCharacters = async (query: CharQueryT): Promise<ActionResult> => {
  const filter: ICharFilter = processFindCharacterFilter(query)
  const result = await CharacterDB.deleteCharacters(filter)
  const { deletedCount } = result
  if (!deletedCount) {
    return new ActionResult({ deletedCount }, 'Failed to delete characters.', new NotFoundError())
  }
  return new ActionResult({ deletedCount }, 'Delete characters success.')
}

export default {
  getCharacterById,
  getCharacterByFilter,
  updateCharacter,
  createCharacter,
  deleteCharacter,
  deleteCharacters
}