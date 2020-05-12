'use strict';

import mongoose from 'mongoose';
import uuid from 'uuid';
import lodash from 'lodash';
import { SendTempPassword } from '../utils/temp-password-helper.js';
import { DefaultCharactersV3 } from '../mock-data/Default-Characters-V3.js';
import { NotFoundError, MongoDBError } from '../errors';
import { UserDB, CharacterDB } from '../data-access';

const cloneDeep = lodash.cloneDeep;

const getUser = async (query) => {
    const filter = {};
    const filterParams = ['name', 'email', '_id'];
    filterParams.forEach((param) => {
        if (query[param]) filter[param] = query[param];
    });
    const result = await UserDB.getUser(filter);
     
    if (!result) {
        throw new NotFoundError();
    }
    return result;
};

const getUsers = async (query) => {
    const filter = {};
    const filterParams = ['name', 'email'];
    filterParams.forEach((param) => {
        if (query[param]) filter[param] = query[param];
    });
  
    const result = await UserDB.getUsers(filter);
    if (result.length < 1) {
    throw new NotFoundError();
    }

    if (query.sendEmail) {
        await SendTempPassword(result);
    }
    return result;
};

const createUser = async (user) => {
    const defaultCharacters = cloneDeep(DefaultCharactersV3);
    defaultCharacters.forEach((character) => {
        character.user = user.name;
        character._id = mongoose.Types.ObjectId();
    });

    user.created = new Date();
    const result = await UserDB.createUser(user, defaultCharacters);

    if (!result) {
        throw new MongoDBError();
    }
    return result;
};

const deleteUser = async (name) => {
    const result = await UserDB.deleteUser(name);
    if (!result || result.n !== 1) {
        throw new NotFoundError();
    }
    
    const filter = { name };
    return await CharacterDB.deleteCharacters(filter);
};


export default {
  createUser,
  getUser,
  getUsers,
  deleteUser,
}