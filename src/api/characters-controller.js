'use strict'

import express from 'express';
import mongodb from 'mongodb';
import CharacterService from '../services/character-service.js';
import { NotFoundError, MongoDBError } from '../errors/index.js';
import AuthServices from '../services/auth-service.js';
const ObjectId = mongodb.ObjectID;

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(422).send(`Invalid character id format: ${id}`);
  }

  try {
    const result = await CharacterService.getCharacter(id);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(err.status).json({ message: `No character found: ${id}` });
    }
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
});

router.get('/', async (req, res) => {
  const { query } = req;
  try {
    const result = await CharacterService.getCharacters(query);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(err.status).json({ message: `No characters found` });
    }
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
});

router.use(AuthServices.jwtCheck);

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { character } = req.body;
  if (!ObjectId.isValid(id)) {
    return res.status(422).send(`Invalid character id format: ${id}`);
  }

  try {
    const result = await CharacterService.updateCharacter(id, character);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(err.status).json({ message: `No characters found` });
    }
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
});

router.post('/', async (req, res) => {
  const { character } = req.body;
  try {
    const result = await CharacterService.createCharacter(character);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof MongoDBError) {
      return res.status(err.status).json({ message: err.message });
    }
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(422).send(`Invalid character id format: ${id}`);
  }

  try {
    const result = await CharacterService.deleteCharacter(id);
    res.status(200).json({ message: 'Character delete success', result });
  } catch (err) {
    if (err instanceof MongoDBError) {
      return res.status(err.status).json({ message: `Character delete failed: ${err.message}` });
    }
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
});

router.delete('/', async (req, res) => {
  const { query } = req;
  try {
    const result = await CharacterService.deleteCharacters(query);
    res.status(200).json({ message: 'Characters delete success', result });
  } catch (err) {
    if (err instanceof MongoDBError) {
      return res.status(err.status).json({ message: `Characters delete failed: ${err.message}` });
    }
    res.status(500).json({ message: `Internal Server Error: ${err.messagerr}` });
  }
});

export default router;