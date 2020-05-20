import { getMongoConnection } from '../utils'
import { IUser, UserFilterType, UserModel } from '../models'

const getUser = async (_id: string) => {
  return await UserModel.findOne({ _id })
}

const getUsers = async (filter: UserFilterType) => {
  const db = await getMongoConnection()
  return await db.collection('users')
    .find(filter)
    .toArray()
}

const createUser = async (user: IUser) => {
  const newUser = await UserModel.create(user)
  return await newUser.save()
}

const updateUser = async (_id: string, user: IUser) => {
  const db = await getMongoConnection()
  return await db.collection("users")
    .updateOne({ _id }, { $set: user })
}

const deleteUser = async (name: string) => {
  return await UserModel.deleteOne({ name })
}

export default {
  createUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser
}