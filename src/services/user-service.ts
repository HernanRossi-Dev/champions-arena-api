import { SendTempPassword, processFindUserFilter, userDupeCheck, insertDefaultCharacters, prepareUpdate, logger } from '../utils'
import { NotFoundError, MongoDBError } from '../errors'
import { UserDB, CharacterDB } from '../data-access'
import { ActionResult, IUserQueryType, IUserFilter, ICharFilter, User } from '../models'
import { ObjectID } from 'mongodb'

const getUserById = async (_id: ObjectID): Promise<ActionResult> => {
  const userDetails = await UserDB.getUserById(_id)
  if (!userDetails?._id) {
    return new ActionResult({}, `Get user failed: ${_id}`, new NotFoundError())
  }
  return new ActionResult(userDetails, `Get user success: ${_id}`)
}

const getUserByQuery = async (query: IUserQueryType): Promise<ActionResult> => {
  const filter: IUserFilter = processFindUserFilter(query)
  const userDetails = await UserDB.getUserByQuery(filter)
  if (!userDetails?._id) {
    return new ActionResult({}, 'Failed to fetch user details.', new NotFoundError())
  }
  if (query.sendEmail) {
    await SendTempPassword(userDetails)
  }
  return new ActionResult(userDetails, 'Get users success.')
}

const createUser = async (user: User): Promise<ActionResult> => {
  const { userName, email } = user
  await userDupeCheck(userName, email)
  await user.setInsertValues()
  const result = await UserDB.createUser(user)
  if (!result._id) {
    return new ActionResult({}, 'Create user failed.', new MongoDBError())
  }
  const insertResult = await insertDefaultCharacters(userName)
  if (insertResult instanceof MongoDBError) {
    return new ActionResult(result, 'Create user success.', insertResult)
  }
  return new ActionResult(result, 'Create user success.\n Default characters insert success.')
}

const updateUser = async (user: User): Promise<ActionResult> => {
  if (!ObjectID.isValid(user._id)) throw new MongoDBError('Invalid search id.')
  const searchId = new ObjectID(user._id)
  prepareUpdate(user)
  const result = await UserDB.updateUser(searchId, user)
  if (!result.nModified) {
    return new ActionResult({}, `Failed to update user: ${searchId}`, new NotFoundError())
  }
  return new ActionResult({ modified: result.nModified }, 'Update user success.')
}

const deleteUser = async (_id: ObjectID, userName: string, deleteCharacters = false): Promise<ActionResult> => {
  const result = await UserDB.deleteUser(_id, userName)
  if (!result.deletedCount) {
    return new ActionResult({}, `Failed to delete user: ${userName}`, new NotFoundError())
  }
  if (deleteCharacters) {
    try {
      const filter: ICharFilter = { userName }
      await CharacterDB.deleteCharacters(filter)
    } catch (err) {
      logger.error({ message: 'Failed to delete users characters: ' + err.message, name: err.name })
    }
  }
  return new ActionResult({ deleted: result.deletedCount }, `Delete User Success: ${userName}`)
}

export default {
  createUser,
  getUserById,
  getUserByQuery,
  deleteUser,
  updateUser
}
