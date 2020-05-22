import { SendTempPassword, processFindUserFilter, userDupeCheck, insertDefaultCharacters, prepareUpdate } from '../utils'
import { NotFoundError, MongoDBError } from '../errors'
import { UserDB, CharacterDB } from '../data-access'
import {  ActionResult, IUserQueryType, IUserFilterType, CharFilterType, User } from '../models'
import { ObjectId } from 'mongodb'

const getUserById = async (id: ObjectId): Promise<ActionResult> => {
  const userDetails = await UserDB.getUserById(id)
  if (!userDetails?._id) {
    return new ActionResult({}, `Get user failed: ${id}`, new NotFoundError())
  }
  return new ActionResult(userDetails, `Get user success: ${id}`)
}

const getUserDetails = async (query: IUserQueryType): Promise<ActionResult> => {
  const filter: IUserFilterType = processFindUserFilter(query)
  const userDetails = await UserDB.getUserDetails(filter)
  if (!userDetails?._id) {
    return new ActionResult({}, 'Failed to fetch user details.', new NotFoundError())
  }
  if (query.sendEmail) {
    await SendTempPassword(userDetails)
  }
  return new ActionResult(userDetails, 'Get users success.')
}

const createUser = async (user: User ): Promise<ActionResult> => {
  const { userName, email } = user
  await userDupeCheck(userName, email)
  await user.setInsertValues()
  const result = await UserDB.createUser(user)
  if (!result._id) {
    return new ActionResult(result, 'Create user failed.', new MongoDBError())
  }
  const insertResult = await insertDefaultCharacters(userName)
  if (insertResult instanceof MongoDBError) {
    return new ActionResult(result, 'Create user success.', insertResult)
  }
  return new ActionResult(result, 'Create user success.\n Default characters insert success.')
}

const updateUser = async (user: User): Promise<ActionResult> => {
  if (!ObjectId.isValid(user._id)) throw new MongoDBError('Invalid search id.')
  const searchId = new ObjectId(user._id)
  prepareUpdate(user)
  const result = await UserDB.updateUser(searchId, user)
  if (!result.nModified) {
    return new ActionResult({}, `Failed to update user: ${searchId}`, new NotFoundError())
  }
  return new ActionResult({modified: 1})
}

const deleteUser = async (userName: string): Promise<ActionResult> => {
  const result = await UserDB.deleteUser(userName)
  if (!result.deletedCount) {
    return new ActionResult(result, `Failed to delete user: ${userName}`, new NotFoundError())
  }

  try {
    const filter: CharFilterType = { user: userName }
    await CharacterDB.deleteCharacters(filter)
  } catch (err) {
    console.error('Failed to delete users characters.')
  }
  return new ActionResult(result, `Delete User Success: ${userName}`)
}

export default {
  createUser,
  getUserById,
  getUserDetails,
  deleteUser,
  updateUser
}
