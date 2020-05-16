'use strict';

import getMongoConnection from '../utils/mongo-connection.js';

const getUser = async (id) => {
  const db = await getMongoConnection();
  return await db.collection('users')
    .find({ _id: id })
    .limit(1)
    .next();
};

const getUsers = async (filter) => {
  const db = await getMongoConnection();
  return await db.collection('users')
    .find(filter)
    .toArray();
};

const createUser = async (user, defaultCharacters) => {
  const db = await getMongoConnection();
  await db.collection('characters').insertMany(defaultCharacters);

  const newUser = await db.collection('users')
    .insertOne(user);

  return await db.collection('users')
    .find({ _id: newUser.insertedId })
    .limit(1)
    .next();
};

const updateUser = async (id, user) => {
  const db = await getMongoConnection();
  await db.collection("users")
    .updateOne({ _id: id }, { $set: user });

  return await db.collection("users")
    .find({ _id: id })
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