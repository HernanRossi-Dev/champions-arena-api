import lodash from 'lodash'
import { logger } from '.'
import { ICharacter, DefaultCharacters } from '../models'
import { CharacterDB } from '../data-access'
import { MongoDBError } from '../errors'
import { ObjectID } from 'mongodb'

const insertDefaultCharacters = async (userName: string): Promise<object> => {
  try {
    const defaultCharacters: ICharacter[] = lodash.cloneDeep(DefaultCharacters)
    defaultCharacters.forEach((character) => {
      character.userName = userName
      character._id = new ObjectID()
    })
    return await CharacterDB.createCharacters(defaultCharacters)
  } catch (err) {
    logger.error({ message: 'Failed to insert default characters: ', error: err.message, stacktrace: err.stacktrace })
    return new MongoDBError('Failed to insert default characters: ' + err.message)
  }
}

const isCharacter = (data: object): boolean => {
  if ((data as ICharacter).userName && (data as ICharacter).basics.name) {
    return true
  }
  return false
}
export {
  insertDefaultCharacters,
  isCharacter
}