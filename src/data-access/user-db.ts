import { IUser, UserFilterType, UserModel } from '../models'

const getUser = async (_id: string) => {
  return await UserModel.findOne({ _id })
}

const getUsers = async (filter: UserFilterType) => {
  return await UserModel.find(filter)
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
  getUser,
  getUsers,
  deleteUser,
  updateUser
}