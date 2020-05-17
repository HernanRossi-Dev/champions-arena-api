'use strict';

import getMongoConnection from '../utils/mongo-connection.js';

const getCharacter = async (_id) => {
  const db = await getMongoConnection();
  return await db.collection('characters')
    .findOne({ _id });
};

const getCharacters = async (filter) => {
  const db = await getMongoConnection();
  return await db.collection('characters')
    .find(filter)
    .toArray();
};

const updateCharacter = async (_id, character) => {
  const db = await getMongoConnection();
  await db.collection("characters")
    .updateOne({ _id }, { $set: character });
};

const createCharacter = async (character) => {
  const db = await getMongoConnection();
  return await db
    .collection("characters")
    .insertOne(character);
};

const deleteCharacter = async (_id) => {
  const db = await getMongoConnection();
  return await db.collection("characters")
    .deleteOne({ _id });
};

const deleteCharacters = async (filter) => {
  const db = await getMongoConnection();
  return await db.collection("characters")
    .deleteMany(filter);
};

export default {
  getCharacter,
  getCharacters,
  updateCharacter,
  createCharacter,
  deleteCharacter,
  deleteCharacters
}