import lodash from 'lodash'
import { Types } from 'mongoose'
import { ICharacter, DefaultCharacters } from '../models'
import { CharacterDB } from '../data-access'
import { MongoDBError } from '../errors'

const insertDefaultCharacters = async (userName: string) : Promise<object> => {
  try {
    const defaultCharacters: ICharacter[] = lodash.cloneDeep(DefaultCharacters)
    defaultCharacters.forEach((character) => {
      character.user = userName
      character._id = Types.ObjectId()
    })
    return await CharacterDB.createCharacters(defaultCharacters)
  } catch (err) {
    console.error('Failed to insert default characters: ', err.message)
    return new MongoDBError('Failed to insert default characters: ' + err.message)
  }
}

export {
  insertDefaultCharacters
}