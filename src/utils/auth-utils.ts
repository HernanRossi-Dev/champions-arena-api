import passwordHash from 'password-hash'
import { UserFilterType } from '../models'
import { UserDB } from '../data-access'

const validateUser = async (email: string, password: string): Promise<boolean> => {
  const filter: UserFilterType = { email }
  const result = await UserDB.getUserDetails(filter)
  const savedPass = result?.password
  if ( savedPass ) {
    return passwordHash.verify(password, savedPass)
  }
  return false
}

export {
  validateUser
}