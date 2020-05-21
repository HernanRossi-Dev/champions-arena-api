import { IUser, UserFilterType, UserModel } from '../models'

const getUserById = async (_id: string) => {
  return await UserModel.findOne({ _id })
}

const getUserDetails = async (filter: UserFilterType) => {
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

const deleteUser = async (name: string) => {
  return await UserModel.deleteOne({ name })
}

export default {
  createUser,
  getUserById,
  getUserDetails,
  deleteUser,
  updateUser
}