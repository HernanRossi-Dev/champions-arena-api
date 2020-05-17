'use strict';

import mongoose from 'mongoose';
import lodash from 'lodash';
import { SendTempPassword } from '../utils/temp-password-helper.js';
import { DefaultCharactersV3 } from '../mock-data/Default-Characters-V3.js';
import { NotFoundError, MongoDBError } from '../errors/index.js';
import ActionResult from '../models/ActionResult.js';
import { UserDB, CharacterDB } from '../data-access/index.js';

const cloneDeep = lodash.cloneDeep;

const getUser = async (id) => {
  const data = await UserDB.getUser(id);
  if (!data || !Object.keys(data).length) {
    return new ActionResult(null, `Get user failed: ${id}`, new NotFoundError());
  }
  return new ActionResult(data, `Get user success: ${id}`);
};

const getUsers = async (query) => {
  const filter = {};
  const filterParams = ['name', 'email', '_id'];
  filterParams.forEach((param) => {
    if (query[param]) filter[param] = query[param];
  });

  const result = await UserDB.getUsers(filter);
  if (query.sendEmail) {
    await SendTempPassword(result);
  }

  if (!result || !result.length) {
    return new ActionResult(result, 'Failed to fetch users.', new NotFoundError());
  }
  return new ActionResult(result, 'Get users success.');
};

const createUser = async (user) => {
  const defaultCharacters = cloneDeep(DefaultCharactersV3);
  defaultCharacters.forEach((character) => {
    character.user = user.name;
    character._id = mongoose.Types.ObjectId();
  });

  user.created = new Date();
  const result = await UserDB.createUser(user, defaultCharacters);
  if(!result || !result.insertedId) {
    return new ActionResult(result, 'Create user failed.', new MongoDBError());
  }
  return new ActionResult(result, 'Create user success.');
};

const updateUser = async (id, user) => {
  delete user._id;
  const result = await UserDB.updateUser(id, user);
  if (!result || !result.modifiedCount) {
    return new ActionResult(result, `Failed to update user: ${id}`, new NotFoundError());
  }
  return new ActionResult(result);
};


const deleteUser = async (name) => {
  const result = await UserDB.deleteUser(name);
  if (!result || !result.deletedCount) {
    return new ActionResult(result, `Failed to delete user: ${name}`, new NotFoundError());
  }

  const filter = { name };
  const deleteChars = await CharacterDB.deleteCharacters(filter);
  return new ActionResult(deleteChars, `Delete User Success: ${name}`);
};

export default {
  createUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser
}
