'use strict';

import express from 'express';
import UserService from '../services/user-service.js';
import { NotFoundError, MongoDBError } from '../errors/index.js';
import AuthServices from '../services/auth-service.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { query } = req;
  try {
    const result = await UserService.getUser(query);
    res.status(200).json({ user: result });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: `No User found: ${id}` });
    } else {
      res.status(500).json({ message: `Internal Server Error: ${err.message}` });
    }
  }
});

//Authenticate for following routes
router.use(AuthServices.jwtCheck);

router.get('/', async (req, res) => {
  const { query } = req;
  try {
    const result = await UserService.getUsers(query);
    res.status(200).json({ users: result });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: `No Users found: ${id}` });
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