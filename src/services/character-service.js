'use strict'

import mongodb from 'mongodb';
import CharacterFilters from '../utils/character-filters.js';
import { CharacterDB } from '../data-access/index.js';
import { NotFoundError, MongoDBError } from '../errors/index.js';

const ObjectId = mongodb.ObjectID;

const getCharacter = async (id) => {
    const character = await CharacterDB.getCharacter(id);
    if (!character) {
        throw new NotFoundError();
    }
    return character;
};

const getCharacters = async (query) => {
    const filter = {}, result = {};
    Object.keys(query).forEach((key) => {
        const value = query[key];
        const addFilter = CharacterFilters[key](value, filter);
        Object.assign(filter, addFilter);
    });

    const characters = await CharacterDB.getCharacters(filter);
    if (!characters && !characters.length) {
        throw new NotFoundError();
    }

    result.metadata = { total_count: characters.length };
    result.characters = characters;
    return result;
};

const updateCharacter = async (id, character) => {
    delete character._id;
    const result = await CharacterDB.updateCharacter(id, character);
    if (!result) {
        throw new NotFoundError();
    }
    return result;
};

const createCharacter = async (character) => {
  character.created = new Date();
  const result = await CharacterDB.createCharacter(character);
  if (!result) {
      throw new MongoDBError();
  }
  return result;
};

const deleteCharacter = async (id) => {
    const { result } = await CharacterDB.deleteCharacter(id);
    if (result.n !== 1) {
      throw new MongoDBError();
    } 
    return result;
};

const deleteCharacters = async (query) => {
  const filter = {};
  const filterParams = ['user', 'class', 'ancestry'];
  filterParams.forEach((param) => {
    if (query[param]) filter[param] = query[param];
  });

  if (query.level_lte || query.level_gte) {
    filter.level = {};
    if (query.level_lte) {
      filter.level.$lte = parseInt(query.level_lte, 10);
    }
    if (query.level_gte) {
      filter.level.$gte = parseInt(query.level_gte, 10);
    }
  }
 
  const result = await CharacterDB.deleteCharacters(filter);
  if (!result) {
    throw new MongoDBError();
  }
  return result;
};

export default {
  getCharacter,
  getCharacters,
  updateCharacter,
  createCharacter,
  deleteCharacter,
  deleteCharacters
}