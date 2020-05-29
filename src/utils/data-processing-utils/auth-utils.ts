import { IUserFilter } from '../../models'
import { UserDB } from '../../api/data-access'
import bcrypt from 'bcrypt'

const validateUser = async (email: string, password: string): Promise<boolean> => {
  const filter: IUserFilter = { email }
  const result = await UserDB.getUserByQuery(filter)
  const savedPass = result?.password
  if ( savedPass ) {
    return bcrypt.compare(password, savedPass)
  }
  return false
}

export {
  validateUser
}