import { IUser, UserModel } from '../models'
import { QueryFindOptions } from 'mongoose'
import { ObjectID } from 'mongodb'

const getUserById = async (_id: ObjectID) => {
  return await UserModel.findOne({ _id })
}

const getUserByQuery = async (filter: QueryFindOptions) => {
  return await UserModel.findOne(filter)
}

const createUser = async (user: IUser) => {
  const newUser = await UserModel.create(user)
  return await newUser.save()
}

const updateUser = async (_id: ObjectID, user: IUser) => {
  return await UserModel.updateOne({ _id }, user, { upsert: true })
}

const deleteUser = async (id: ObjectID, userName: string) => {
  return await UserModel.deleteOne({ id, userName })
}

export default {
  createUser,
  getUserById,
  getUserByQuery,
  deleteUser,
  updateUser
}