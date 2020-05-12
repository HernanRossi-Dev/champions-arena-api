'use strict';

import express from 'express';
import UserService from '../services/user-service.js';
import { NotFoundError, MongoDBError } from '../errors';
import { jwtCheck } from '../services/auth-service.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { query } = req;
  try {
    const result = await UserService.getUser(query);
    res.status(200).json({ user: result }).end();
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: `No User found: ${id}` }).end();
    }
    res.status(500).json({ message: `Internal Server Error: ${err}` }).end();
  }
});

//Authenticate for following routes
router.use(jwtCheck());

router.get('/', async (req, res) => {
  const { query } = req;
  try {
    const result = await UserService.getUsers(query);
    res.status(200).json({ users: result }).end();
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: `No Users found: ${id}` }).end();
    }
    res.status(500).json({ message: `Internal Server Error: ${err}` }).end();
  }
});

router.post('/', async (req, res) => {
  const { body } = req;
  try {
    const result = await UserService.createUser(body);
    res.status(200).json({ user: result }).end();
  } catch (err) {
    if (err instanceof MongoDBError) {
      res.status(404).json({ message: `Failed to create user`, body }).end();
    }
    res.status(500).json({ message: `Internal Server Error: ${err}` }).end();
  }
});

router.delete('/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const result = await UserService.deleteUser(name);
    res.status(200).json({ message: 'Delete user success' }).end();
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: `Failed to delete user`, body }).end();
    }
    res.status(500).json({ message: `Internal Server Error: ${err}` }).end();
  }
});

export default router;