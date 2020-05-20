import mongoose from 'mongoose'
import lodash from 'lodash'
import { SendTempPassword } from '../utils'
import { NotFoundError, MongoDBError } from '../errors/index'
import { ActionResult } from '../models'
import { UserDB, CharacterDB } from '../data-access/index'
import { UserQuery, UserFilter, CharFilter } from '../utils/types'
import { IUser, ICharacter } from '../models/interfaces'
import { DefaultCharacters } from '../mock-data'

const cloneDeep = lodash.cloneDeep

const getUser = async (id: string, query: UserQuery): Promise<ActionResult> => {
  const result = await UserDB.getUser(id)
  if (!result?._id) {
    return new ActionResult({}, `Get user failed: ${id}`, new NotFoundError())
  }
  if (query.sendEmail) {
    await SendTempPassword(result)
  }
  return new ActionResult(result, `Get user success: ${id}`)
}

const getUsers = async (query: UserQuery): Promise<ActionResult> => {
  const filter: UserFilter = {}
  const filterParams = ['name', 'email', '_id']
  filterParams.map((param) => {
    if (query[param as keyof UserQuery]) {
      filter[param as keyof UserFilter] = query[param as keyof UserQuery]
    }
  })

  const result = await UserDB.getUsers(filter)
  if (!result.length) {
    return new ActionResult(result, 'Failed to fetch users.', new NotFoundError())
  }
  return new ActionResult(result, 'Get users success.')
}

const createUser = async (user: IUser): Promise<ActionResult> => {
  const defaultCharacters: ICharacter[] = cloneDeep(DefaultCharacters)
  defaultCharacters.forEach((character) => {
    character.user = user.name
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

  const filter: CharFilter = { name }
  const deleteChars = await CharacterDB.deleteCharacters(filter)
  return new ActionResult(deleteChars, `Delete User Success: ${name}`)
}

export default {
  createUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser
}
