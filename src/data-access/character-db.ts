import getMongoConnection from '../utils/mongo-connection'
import { CharFilter } from '../utils'
import { CharacterModel } from '../models'
import { ICharacter } from '../models/interfaces'
import { ICharacterDoc } from '../models/mongoose-models';

const getCharacter = async (_id: string) => {
  return CharacterModel.findOne({ _id })
};

const getCharacters = async (filter: CharFilter) => {
  const db = await getMongoConnection();
  return await db.collection('characters')
    .find(filter)
    .toArray();
};

const updateCharacter = async (_id: string, character: ICharacter) => {
  const db = await getMongoConnection();
  return await db.collection("characters")
    .updateOne({ _id }, { $set: character });
};

const createCharacter = async (character: ICharacter): Promise<ICharacterDoc> => {
  const newCharacter = await CharacterModel.create(character)
  return newCharacter.save()
};

const createCharacters = async (characters: ICharacter[]) => {
  return await CharacterModel.insertMany(characters)
};

const deleteCharacter = async (_id: string) => {
  return await CharacterModel.deleteOne({ _id })
};

const deleteCharacters = async (filter: CharFilter) => {
  return await CharacterModel.deleteMany(filter)
};

export default {
  getCharacter,
  getCharacters,
  updateCharacter,
  createCharacter,
  createCharacters,
  deleteCharacter,
  deleteCharacters
}