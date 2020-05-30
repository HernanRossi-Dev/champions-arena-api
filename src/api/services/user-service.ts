import { ObjectID } from 'mongodb'
import { SendTempPassword, processFindUserFilter, insertDefaultCharacters, logger } from '../../utils'
import { NotFoundError, MongoDBError } from '../../errors'
import { UserDB, CharacterDB } from '../data-access'
import { ActionResult, IUserQueryType, IUserFilter, ICharFilter, User, DeleteUserQueryT } from '../../models'
import { userDupeCheck, prepareUserUpdate } from '../../utils/data-processing-utils/user-utils'

const getUserById = async (_id: ObjectID): Promise<ActionResult> => {
  const userDetails = await UserDB.getUserById(_id)
  if (!userDetails?.userName) {
    return new ActionResult({}, `Get user failed: ${_id}`, new NotFoundError())
  }
  return new ActionResult(userDetails, `Get user success: ${_id}`)
}

const getUserByQuery = async (query: IUserQueryType): Promise<ActionResult> => {
  const filter: IUserFilter = processFindUserFilter(query)
  const userDetails = await UserDB.getUserByQuery(filter)
  if (!userDetails?._id) {
    return new ActionResult({}, 'Failed to fetch user.', new NotFoundError())
  }
  if (query.sendEmail) {
    await SendTempPassword(userDetails)
  }
  return new ActionResult(userDetails, 'Get user success.')
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
    return new ActionResult(result, 'Create user success. Default characters not created', insertResult)
  }
  return new ActionResult(result, 'Create user success. Default characters created.')
}

const updateUser = async (user: User): Promise<ActionResult> => {
  const searchId = new ObjectID(user._id)
  const updateUser = prepareUserUpdate(user)
  const result = await UserDB.updateUser(searchId, updateUser)
  const modifiedCount = result.nModified
  if (!modifiedCount) {
    return new ActionResult({ modifiedCount }, `Failed to update user: ${searchId}`, new NotFoundError())
  }
  return new ActionResult({ modifiedCount }, 'Update user success.')
}

const deleteUser = async (query: DeleteUserQueryT): Promise<ActionResult> => {
  const { _id, userName, deleteCharacters } = query
  const searchId = new ObjectID(_id)
  const result = await UserDB.deleteUser(searchId, userName)
  const { deletedCount } = result
  if (!deletedCount) {
    return new ActionResult({ deletedCount }, `Failed to delete user: ${userName}`, new NotFoundError())
  }
  let deleteCharMessage = ''
  if (deleteCharacters) {
    try {
      const filter: ICharFilter = { userName }
      await CharacterDB.deleteCharacters(filter)
      deleteCharMessage += ' User characters deleted.'
    } catch (err) {
      logger.error({ message: 'Failed to delete users characters: ' + err.message, name: err.name })
    }
  }
  return new ActionResult({ deletedCount }, `Delete User Success: ${userName}.` + deleteCharMessage)
}

export default {
  createUser,
  getUserById,
  getUserByQuery,
  deleteUser,
  updateUser
}
