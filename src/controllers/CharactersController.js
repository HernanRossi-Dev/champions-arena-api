'use strict'

import mongoose from 'mongoose';
import CharacterFilters from '../utils/CharacterFilters.js';
import getMongoConnection from '../utils/MongoConnection.js';

const getCharacter = async (req, res) => {
  let characterID, character;

  try {
    const db = await getMongoConnection();
    characterID = new mongoose.Types.ObjectId(req.params.id);
    character = await db.collection('characters')
      .find({ _id: characterID })
      .limit(1)
      .next();

    if (!character) {
      return res.status(404).json({ message: `No character found: ${characterID}` });
    }

    res.json(character);
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error: ${err}` });
  }
};

const getCharacters = async (req, res) => {
  const filter = {};
  Object.keys(req.query).forEach((key) => {
    const value = req.query[key];

    const addFilter = CharacterFilters[key](value, filter);
    Object.assign(filter, addFilter);
  });
  try {
    const db = await getMongoConnection();
    const characters = await db.collection('characters')
      .find(filter)
      .toArray();
    
    const metadata = { total_count: characters.length };
    res.json({ metadata, characters });
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error: ${err}` });
  }
};

const updateCharacter = async (req, res) => {
  let characterId;
  const character = req.body;
  delete character._id;

  try {
    characterId = new mongoose.Types.ObjectId(req.params.id);
    const db = await getMongoConnection();
    await db.collection("characters")
      .updateOne({ _id: characterId }, { $set: character });
    
      const saveResult = await db.collection("characters")
      .find({ _id: characterId })
      .limit(1)
      .next();
    
    res.json(saveResult);
  } catch (err) {
    res.status(500).json({ message: `Failed to save character: ${err}` }).send();
  }  
};

const createCharacter = async (req, res) => {
  const newCharacter = req.body;
  newCharacter.created = new Date();
  let insertResult;
  try {
    const db = await getMongoConnection();
    insertResult = await db
      .collection("characters")
      .insertOne(newCharacter);
    res.status(200).json(insertResult);
  } catch (err) {
    res.status(500).json({ message: `Error creating new character: ${err}` });
  }
};

const deleteCharacter = async (req, res) => {
  let characterID, deleteResult;
  try {
    characterID = new mongoose.Types.ObjectId(req.params.id);

    const db = await getMongoConnection();
    deleteResult = await db.collection("characters")
      .deleteOne({ _id: characterID });
    if (deleteResult.result.n === 1) {
      res.status(200).json({ message: `Delete character success.`, status: `OK`, result: deleteResult });
    } else {
      res.status(500).json({ message: `Delete character failure.`, result: deleteResult });
    }
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error, failed to delete character: ${err}` });
  }
};

const deleteCharacters = async (req, res) => {
  const filter = {};
  if (req.query.user) {
    filter.user = req.query.user;
  }
  if (req.query.class) {
    filter.class = req.query.class;
  }
  if (req.query.ancestry) {
    filter.ancestry = req.query.ancestry;
  }
  if (req.query.level_lte || req.query.level_gte) {
    filter.level = {};
  }
  if (req.query.level_lte) {
    filter.level.$lte = parseInt(req.query.level_lte, 10);
  }
  if (req.query.level_gte) {
    filter.level.$gte = parseInt(req.query.level_gte, 10);
  }
  let deleteResult;
  try {
    const db = await getMongoConnection();
    deleteResult = await db.collection("characters")
      .deleteMany(filter);
    res.status(200).json({ message: `Deleting characters success.`, status: `OK`, payload: deleteResult });
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error, failed to delete characters: ${err}` });
  }
};

export default {
  getCharacter,
  getCharacters,
  updateCharacter,
  createCharacter,
  deleteCharacter,
  deleteCharacters
}