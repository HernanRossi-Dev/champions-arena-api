'use strict';

import express from 'express';
import UserService from '../services/user-service.js';
import { NotFoundError, MongoDBError } from '../errors/index.js';
import AuthServices from '../services/auth-service.js';
import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectID;
const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(422).send(`Invalid user id format: ${id}`);
  }
  try {
    const result = await UserService.getUser(id);
    res.status(200).json({ user: result });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: `No User found: ${id}` });
    } else {
      res.status(500).json({ message: `Internal Server Error: ${err.message}` });
    }
  }
});

router.use(AuthServices.jwtCheck);

router.get('/', async (req, res) => {
  const { query } = req;
  try {
    const result = await UserService.getUsers(query);
    res.status(200).json({ users: result });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: `No Users found: ${query}` });
    } else {
      res.status(500).json({ message: `Internal Server Error: ${err.message}` });
    }
  }
});

router.post('/', async (req, res) => {
  const { body } = req;
  try {
    const result = await UserService.createUser(body);
    res.status(200).json({ user: result });
  } catch (err) {
    if (err instanceof MongoDBError) {
      res.status(404).json({ message: `Failed to create user`, body });
    } else {
      res.status(500).json({ message: `Internal Server Error: ${err.message}` });
    }
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  if (!ObjectId.isValid(id)) {
    return res.status(422).send(`Invalid user id format: ${id}`);
  }

  try {
    const result = await UserService.updateUser(id, user);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(err.status).json({ message: `No user found` });
    }
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
  }
});

router.delete('/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const result = await UserService.deleteUser(name);
    res.status(200).json({ message: 'Delete user success' });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: `Failed to delete user`, body });
    } else {
      res.status(500).json({ message: `Internal Server Error: ${err.message}` });
    }
  }
});

export default router;