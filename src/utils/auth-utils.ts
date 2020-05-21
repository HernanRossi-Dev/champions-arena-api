import { UserFilterType } from '../models'
import { UserDB } from '../data-access'
import bcrypt from 'bcrypt'

const validateUser = async (email: string, password: string): Promise<boolean> => {
  const filter: UserFilterType = { email }
  const result = await UserDB.getUserDetails(filter)
  const savedPass = result?.password
  if ( savedPass ) {
    return bcrypt.compare(password, savedPass)
  }
  return false
}

export {
  validateUser
}