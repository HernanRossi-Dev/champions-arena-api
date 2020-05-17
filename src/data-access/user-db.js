'use strict';

import getMongoConnection from '../utils/mongo-connection.js';

const getUser = async (_id) => {
  const db = await getMongoConnection();
  return await db.collection('users')
    .findOne({ _id });
};

const getUsers = async (filter) => {
  const db = await getMongoConnection();
  return await db.collection('users')
    .find(filter)
    .toArray();
};

const createUser = async (user, defaultCharacters) => {
  const db = await getMongoConnection();
  const newUser = await db.collection('users')
    .insertOne(user);

  try {
    await db.collection('characters').insertMany(defaultCharacters);
  } catch (err) {
    console.err('Failed to create default characters for new user.');
  }
  return newUser;
};

const updateUser = async (_id, user) => {
  const db = await getMongoConnection();
  await db.collection("users")
    .updateOne({ _id }, { $set: user });

  return await db.collection("users")
    .find({ _id })
    .limit(1)
    .next();
};

const deleteUser = async (name) => {
  return await server.db
    .collection('users')
    .deleteOne({ name });
};

export default {
  createUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser
}