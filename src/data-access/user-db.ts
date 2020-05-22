import { IUser, UserModel } from '../models'
import { QueryFindOptions } from 'mongoose'
import { Types } from 'mongoose'

const getUserById = async (_id: Types.ObjectId) => {
  return await UserModel.findOne({ _id })
}

const getUserDetails = async (filter: QueryFindOptions) => {
  return await UserModel.findOne(filter)
}

const createUser = async (user: IUser) => {
  const newUser = await UserModel.create(user)
  return await newUser.save()
}

const updateUser = async (_id: Types.ObjectId, user: IUser) => {
  return await UserModel.updateOne({ _id }, user, { upsert: true })
}

const deleteUser = async (userName: string) => {
  return await UserModel.deleteOne({ userName })
}

export default {
  createUser,
  getUserById,
  getUserDetails,
  deleteUser,
  updateUser
}