'use strict';

import mongoose from 'mongoose';
import uuid from 'uuid';
import lodash from 'lodash';
import { SendTempPassword } from '../utils/TempPasswordHelper.js';
import { DefaultCharactersV3 } from '../mock-data/DefaultCharactersV3.js';
import getMongoConnection from '../utils/MongoConnection.js';

const cloneDeep = lodash.cloneDeep;

const createUser = async (req, res) => {
  const newUser = req.body;
  const insertChars = cloneDeep(DefaultCharactersV3);
  insertChars.forEach((character) => {
    character.user = newUser.name;
    character._id = mongoose.Types.ObjectId();
  });

  try {
    const db = await getMongoConnection();
    await db.collection('characters').insertMany(insertChars);

    newUser.created = new Date();
    let createUser;
  
    createUser = await db.collection('users')
      .insertOne(newUser);

    const returnNewUser = await db.collection('users')
      .find({ _id: createUser.insertedId })
      .limit(1)
      .next();
    res.json(returnNewUser);
  } catch (err) {
    res.status(500).json({ message: `Failed to create new user: ${err}` });
  }
};

const createUserBasic = async (req, res) => {
  const newUser = req.body;
  newUser.created = new Date();
  newUser._id = uuid.v4();

  try {
    const db = await getMongoConnection();
    await db.collection('users')
      .insertOne(newUser);
      res.status(200).json(newUser._id);
  } catch (err) {
    console.error('Internal Server Error', err.message);
    res.status(500).json({ message: `Failed to create new user: ${err}` });
  }
};

const getUsers = async (req, res) => {
  const filter = {};
  if (req.query.name) {
    filter.name = req.query.name;
  }
  if (req.query.email) {
    filter.email = req.query.email;
  }
  let users;

  try {
    const db = await getMongoConnection();

    users = await db.collection('users')
      .find(filter)
      .toArray();
    if (users.length < 1) {
      return res.status(404).send();
    }

    if (req.query.sendEmail) {
      await SendTempPassword(server, users);
    }

    res.status(200).json({ users });
  } catch (err) {
    console.error('Internal Server Error', err.message);
    res.status(500).json({ message: `Internal Server Error: ${err}` });
  }
};

const getUser = async (req, res) => {
  const filter = {};
  if (req.query.name) {
    filter.name = req.query.name;
  }
  if (req.query.email) {
    filter.email = req.query.email;
  }
  if (req.query._id) {
    filter._id = req.query._id;
  }
  let user;
  
  try {
    const db = await getMongoConnection();
    user = await db.collection('users')
      .findOne(filter);
    res.status(200).json({ user });
  } catch (err) {
    console.error('Internal Server Error', err.message);
    res.status(500).json({ message: `Internal Server Error: ${err}` });
  }
};

const deleteUsers = async (req, res) => {
  const deleteUser = req.query;
  const filter = {};
  if (deleteUser.name) {
    filter.name = req.query.name;
  }
  if (deleteUser.email) {
    filter.email = req.query.email;
  }
  let deleteUserResult;
  try {
    const db = await getMongoConnection();
    deleteUserResult = await db.collection('users')
      .deleteMany(filter);

    if (!(deleteUserResult.result.n === 1)) {
      return res.status(404).json({ status: 'Warning: object not found' });
    }
  
    await db.collection('characters')
      .deleteMany({ user: deleteUser.name });

    res.status(200).json({ message: 'Delete characters success' });

    } catch (err) {
      console.error('Internal Server Error', err.message);
      res.status(500).json({ message: `Failed to delete user: ${err}` });
  }
};

const deleteUser = async (req, res) => {
  const deleteUser = req.params.name;
  let deleteResult;
  try {
    deleteResult = await server.db
      .collection('users')
      .deleteOne({ name: deleteUser });

      if (deleteResult.result.n === 1) {
        await server.db
        .collection('characters')
        .deleteMany({ user: deleteUser });
        res.status(200).json({ status: 'OK', message: 'Delete user success' });
      } else {
        res.status(500).json({ message: `Failed to delete user.` });
      }
  } catch (err) {
    console.error('Internal Server Error', err.message);
    res.status(500).json({ message: `Internal Server Error: ${err}` });
  }
};

export default {
  createUser,
  createUserBasic,

  getUser,
  getUsers,

  deleteUser,
  deleteUsers,
}