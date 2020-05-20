import getMongoConnection from '../utils/mongo-connection.js';
import { IUser } from '../models/interfaces/index.js';
import { UserFilter } from '../utils/types/index.js';
import { UserModel } from '../models/index.js';

const getUser = async (_id: string) => {
  return await UserModel.findOne({ _id })
};

const getUsers = async (filter: UserFilter) => {
  const db = await getMongoConnection();
  return await db.collection('users')
    .find(filter)
    .toArray();
};

const createUser = async (user: IUser) => {
  const newUser = await UserModel.create(user)
  return await newUser.save()
};

const updateUser = async (_id: string, user: IUser) => {
  const db = await getMongoConnection();
  return await db.collection("users")
    .updateOne({ _id }, { $set: user });
};

const deleteUser = async (name: string) => {
  return await UserModel.deleteOne({ name })
};

export default {
  createUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser
}