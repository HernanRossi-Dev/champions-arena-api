'use strict'

import express from 'express';
import CharacterService from '../services/character-service.js';
import { NotFoundError, MongoDBError } from '../errors';
import { jwtCheck } from '../services/auth-service.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await CharacterService.getCharacter(id);
    res.status(200).json(result).end();
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: `No character found: ${id}` }).end();
    }
    res.status(500).json({ message: `Internal Server Error: ${err}` }).end();
  }
});

router.get('/', async (req, res) => {
  const { query } = req;
  try {
    const result = await CharacterService.getCharacters(query);
    res.json(result).status(200).end();
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: `No characters found` }).end();
    }
    res.status(500).json({ message: `Internal Server Error: ${err}` });
  }
});

//Authenticate for following routes
router.use(jwtCheck());

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { character } = req.body;
  try {
    const result = await CharacterService.updateCharacter(id, character);
    res.status(200).json(result).end();
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(err.status).json({ message: `No characters found` }).end();
    }
    res.status(500).json({ message: `Internal Server Error: ${err}` });
  }
});

router.post('/', async (req, res) => {
  const { character } = req.body;
  try {
    const result = await CharacterService.createCharacter(character);
    res.status(200).json(result).end();
  } catch (err) {
    if (err instanceof MongoDBError) {
      res.status(err.status).json({ message: err.message }).end();
    }
    res.status(500).json({ message: `Internal Server Error: ${err}` });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await CharacterService.deleteCharacter(id);
    res.status(200).json({ message: 'Character delete success', result }).end();
  } catch (err) {
    if (err instanceof MongoDBError) {
      res.status(err.status).json({ message: `Character delete failed: ${err.message}` }).end();
    }
    res.status(500).json({ message: `Internal Server Error: ${err}` });
  }
});

router.delete('/', async (req, res) => {
  const { query } = req;
  try {
    const result = await CharacterService.deleteCharacters(query);
    res.status(200).json({ message: 'Characters delete success', result }).end();
  } catch (err) {
    if (err instanceof MongoDBError) {
      res.status(err.status).json({ message: `Characters delete failed: ${err.message}` }).end();
    }
    res.status(500).json({ message: `Internal Server Error: ${err}` });
  }
});

export default router;