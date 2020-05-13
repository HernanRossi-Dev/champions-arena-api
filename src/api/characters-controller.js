'use strict'

import express from 'express';
import CharacterService from '../services/character-service.js';
import { NotFoundError, MongoDBError } from '../errors/index.js';
import AuthServices from '../services/auth-service.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await CharacterService.getCharacter(id);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: `No character found: ${id}` });
    } else {
      res.status(500).json({ message: `Internal Server Error: ${err}` });
    }
  }
});

router.get('/', async (req, res) => {
  const { query } = req;
  try {
    const result = await CharacterService.getCharacters(query);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: `No characters found` });
    } else {
      res.status(500).json({ message: `Internal Server Error: ${err}` });
    }
  }
});

//Authenticate for following routes
router.use(AuthServices.jwtCheck);

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { character } = req.body;
  try {
    const result = await CharacterService.updateCharacter(id, character);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(err.status).json({ message: `No characters found` });
    } else {
      res.status(500).json({ message: `Internal Server Error: ${err}` });
    }
  }
});

router.post('/', async (req, res) => {
  const { character } = req.body;
  try {
    const result = await CharacterService.createCharacter(character);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof MongoDBError) {
      res.status(err.status).json({ message: err.message });
    } else {
      res.status(500).json({ message: `Internal Server Error: ${err}` });
    }
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await CharacterService.deleteCharacter(id);
    res.status(200).json({ message: 'Character delete success', result });
  } catch (err) {
    if (err instanceof MongoDBError) {
      res.status(err.status).json({ message: `Character delete failed: ${err.message}` });
    } else {
      res.status(500).json({ message: `Internal Server Error: ${err}` });
    }
  }
});

router.delete('/', async (req, res) => {
  const { query } = req;
  try {
    const result = await CharacterService.deleteCharacters(query);
    res.status(200).json({ message: 'Characters delete success', result });
  } catch (err) {
    if (err instanceof MongoDBError) {
      res.status(err.status).json({ message: `Characters delete failed: ${err.message}` });
    } else {
      res.status(500).json({ message: `Internal Server Error: ${err}` });
    }
  }
});

export default router;