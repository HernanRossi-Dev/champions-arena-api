import bcrypt from 'bcrypt'
import { Types } from 'mongoose'
import { SendTempPassword, processFindUserFilter, userDupeCheck, insertDefaultCharacters } from '../utils'
import { NotFoundError, MongoDBError } from '../errors'
import { UserDB, CharacterDB } from '../data-access'
import { IUser, ActionResult, IUserQueryType, IUserFilterType, CharFilterType } from '../models'

const getUserById = async (id: string): Promise<ActionResult> => {
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

const createUser = async (user: IUser): Promise<ActionResult> => {
  const { userName, email } = user
  const isDupe = await userDupeCheck(userName, email)
  if (isDupe) return <ActionResult>isDupe
  user.created = new Date()
  user._id = new Types.ObjectId()
  user.password = await bcrypt.hash(user.password, 10)
  const result = await UserDB.createUser(user)
  if (!result._id) {
    return new ActionResult(result, 'Create user failed.', new MongoDBError())
  }
  const insertResult = await insertDefaultCharacters(userName)
  if (insertResult instanceof MongoDBError) {
    return new ActionResult(result, 'Create user success.', insertResult)
  }
  return new ActionResult(result, 'Create user success.\n Default characters inserted: ' + insertResult)
}

const updateUser = async (id: string, user: IUser): Promise<ActionResult> => {
  delete user._id
  delete user.userName
  delete user.isGuest
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10)
  }
  user.updated = new Date()
  const result = await UserDB.updateUser(id, user)
  if (!result.modifiedCount) {
    return new ActionResult(result, `Failed to update user: ${id}`, new NotFoundError())
  }
  return new ActionResult(result)
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
