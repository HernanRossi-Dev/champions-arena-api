'use strict';

import getMongoConnection from '../utils/mongo-connection.js';

const getCharacter = async (id) => {
    const db = await getMongoConnection();
    return await db.collection('characters')
    .find({ _id: id })
    .limit(1)
    .next();
};

const getCharacters = async (filter) => {
    const db = await getMongoConnection();
    return await db.collection('characters')
    .find(filter)
    .toArray();
};

const updateCharacter = async (id, character) => {
    const db = await getMongoConnection();
    await db.collection("characters")
    .updateOne({ _id: id }, { $set: character });
    
    return await db.collection("characters")
    .find({ _id: id })
    .limit(1)
    .next();
};
  
const createCharacter = async (character) => {
    const db = await getMongoConnection();
    return await db
    .collection("characters")
    .insertOne(newCharacter);
};

const deleteCharacter = async (id) => {
    const db = await getMongoConnection();
    return await db.collection("characters")
        .deleteOne({ _id: id });
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