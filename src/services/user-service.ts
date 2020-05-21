import mongoose from 'mongoose'
import lodash from 'lodash'
import { SendTempPassword, processFindUserFilter, userFullName } from '../utils'
import { NotFoundError, MongoDBError } from '../errors'
import { UserDB, CharacterDB } from '../data-access'
import { UserQueryType, UserFilterType, CharFilterType } from '../models/types'
import { IUser, ICharacter, DefaultCharacters, ActionResult } from '../models'

const cloneDeep = lodash.cloneDeep

const getUserById = async (id: string, query: UserQueryType): Promise<ActionResult> => {
  const result = await UserDB.getUserById(id)
  if (!result?._id) {
    return new ActionResult({}, `Get user failed: ${id}`, new NotFoundError())
  }
  if (query.sendEmail) {
    await SendTempPassword(result)
  }
  return new ActionResult(result, `Get user success: ${id}`)
}

const getUserDetails = async (query: UserQueryType): Promise<ActionResult> => {
  const filter: UserFilterType = processFindUserFilter(query)
  const result = await UserDB.getUserDetails(filter)
  if (!result.length) {
    return new ActionResult(result, 'Failed to fetch users.', new NotFoundError())
  }
  return new ActionResult(result, 'Get users success.')
}

const createUser = async (user: IUser): Promise<ActionResult> => {
  const defaultCharacters: ICharacter[] = cloneDeep(DefaultCharacters)
  defaultCharacters.forEach((character) => {
    character.user = userFullName(user)
    character._id = mongoose.Types.ObjectId()
  })

  user.created = new Date()
  const result = await UserDB.createUser(user)
  if (!result.insertedId) {
    return new ActionResult(result, 'Create user failed.', new MongoDBError())
  }
  try {
    await CharacterDB.createCharacters(defaultCharacters)
  } catch (err) {
    console.error('Failed to insert default characters.')
  }
  return new ActionResult(result, 'Create user success.')
}

const updateUser = async (id: string, user: IUser): Promise<ActionResult> => {
  delete user._id
  const result = await UserDB.updateUser(id, user)
  if (!result.modifiedCount) {
    return new ActionResult(result, `Failed to update user: ${id}`, new NotFoundError())
  }
  return new ActionResult(result)
}

const deleteUser = async (name: string): Promise<ActionResult> => {
  const result = await UserDB.deleteUser(name)
  if (!result.deletedCount) {
    return new ActionResult(result, `Failed to delete user: ${name}`, new NotFoundError())
  }

  const filter: CharFilterType = { name }
  const deleteChars = await CharacterDB.deleteCharacters(filter)
  return new ActionResult(deleteChars, `Delete User Success: ${name}`)
}

export default {
  createUser,
  getUserById,
  getUserDetails,
  deleteUser,
  updateUser
}
