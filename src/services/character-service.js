'use strict'

import CharacterFilters from '../utils/character-filters.js';
import { CharacterDB } from '../data-access/index.js';
import ActionResult from '../models/ActionResult.js';
import { MongoDBError, NotFoundError } from '../errors/index.js';

const getCharacter = async (id) => {
  const data = await CharacterDB.getCharacter(id);
  if (!data || !Object.keys(data).length) {
    return new ActionResult(null, `Get character failed: ${id}`, new NotFoundError());
  }
  return new ActionResult(data, `Get character success: ${id}`);
};

const getCharacters = async (query) => {
  const filter = {};
  Object.keys(query).forEach((key) => {
    const value = query[key];
    const addFilter = CharacterFilters[key](value, filter);
    Object.assign(filter, addFilter);
  });

  const result = await CharacterDB.getCharacters(filter);
  if (!result || !result.length) {
    return new ActionResult(result, 'Failed to fetch characters.', new NotFoundError());
  }
  return new ActionResult(result, 'Get characters success.');
};

const updateCharacter = async (id, character) => {
  delete character._id;
  const result = await CharacterDB.updateCharacter(id, character);
  if (!result || !result.modifiedCount) {
    return new ActionResult(result, `Failed to update character: ${id}`, new NotFoundError());
  }
  return new ActionResult(result, 'Update character succes.');
};

const createCharacter = async (character) => {
  character.created = new Date();
  const result = await CharacterDB.createCharacter(character);
  if (!result || !result.insertedId) {
    return new ActionResult(result, 'Create character failed.', new MongoDBError());
  }
  return new ActionResult(result, 'Create character success.');
};

const deleteCharacter = async (id) => {
  const result = await CharacterDB.deleteCharacter(id);
  if (!result || !result.deletedCount) {
    return new ActionResult(result, `Failed to delete character: ${id}`, new NotFoundError());
  }
  return new ActionResult(result, `Delete character success: ${id}`);
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
  if (!result || !result.deletedCount) {
    return new ActionResult(result, 'Failed to delete characters.', new NotFoundError());
  }
  return new ActionResult(result, 'Delete characters success.');
};

export default {
  getCharacter,
  getCharacters,
  updateCharacter,
  createCharacter,
  deleteCharacter,
  deleteCharacters
}