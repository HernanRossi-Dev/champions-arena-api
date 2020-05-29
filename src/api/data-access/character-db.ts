import { CharacterModel, ICharacter } from '../../models'
import { QueryFindOptions } from 'mongoose'
import { ObjectID } from 'mongodb'

const getCharacterById = async (_id: ObjectID) => {
  return await CharacterModel.findOne({ _id })
}

const getCharacterByFilter = async (filter: QueryFindOptions) => {
  return await CharacterModel.find(filter)
}

const createCharacter = async (character: ICharacter) => {
  const newCharacter = await CharacterModel.create(character)
  return await newCharacter.save()
}

const createCharacters = async (characters: ICharacter[]) => {
  return await CharacterModel.insertMany(characters)
}

const updateCharacter = async (character: ICharacter) => {
  return await CharacterModel.updateOne({ _id: character._id }, character, { upsert: true })
}

const deleteCharacter = async (_id: ObjectID) => {
  return await CharacterModel.deleteOne({ _id })
}

const deleteCharacters = async (filter: QueryFindOptions) => {
  return await CharacterModel.deleteMany(filter)
}

export default {
  getCharacterById,
  getCharacterByFilter,
  updateCharacter,
  createCharacter,
  createCharacters,
  deleteCharacter,
  deleteCharacters
}