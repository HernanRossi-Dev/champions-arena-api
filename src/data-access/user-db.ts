import { IUser, IUserFilterType, UserModel } from '../models'
import { QueryFindOptions } from 'mongoose'

const getUserById = async (_id: string) => {
  return await UserModel.findOne({ _id })
}

const getUserDetails = async (filter: QueryFindOptions) => {
  return await UserModel.findOne(filter)
}

const createUser = async (user: IUser) => {
  const newUser = await UserModel.create(user)
  return await newUser.save()
}

const updateUser = async (_id: string, user: IUser) => {
  delete user._id
  return await UserModel.update({ _id }, user, { upsert: true })
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