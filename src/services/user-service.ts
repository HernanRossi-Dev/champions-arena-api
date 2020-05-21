import mongoose from 'mongoose'
import lodash from 'lodash'
import bcrypt from 'bcrypt'
import { Types } from 'mongoose'
import { SendTempPassword, processFindUserFilter, userDupeCheck } from '../utils'
import { NotFoundError, MongoDBError } from '../errors'
import { UserDB, CharacterDB } from '../data-access'
import { IUserQueryType, IUserFilterType, CharFilterType } from '../models/types'
import { IUser, ICharacter, DefaultCharacters, ActionResult } from '../models'

const cloneDeep = lodash.cloneDeep

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
  const saltRounds = 10
  user.password = await bcrypt.hash(user.password, saltRounds)
  const result = await UserDB.createUser(user)
  if (!result._id) {
    return new ActionResult(result, 'Create user failed.', new MongoDBError())
  }
  try {
    const defaultCharacters: ICharacter[] = cloneDeep(DefaultCharacters)
    defaultCharacters.forEach((character) => {
      character.user = user.userName
      character._id = mongoose.Types.ObjectId()
    })
    await CharacterDB.createCharacters(defaultCharacters)
  } catch (err) {
    const actionError = new MongoDBError(`Failed to insert default characters: ${err.message}`)
    return new ActionResult(result, 'Create user success.', actionError)
  }
  return new ActionResult(result, 'Create user success.')
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
