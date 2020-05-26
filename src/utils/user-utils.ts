import { IUserDupeFilter, IUser, User } from '../models'
import { UserDB } from '../data-access'
import { MongoDBError } from '../errors'

const userFullName = (user: IUser): string => {
  return user.firstName + ' ' + user.lastName
}

const isUser = (data: object) => {
  if ((data as IUser).userName && (data as IUser).email) {
    return true
  }
  return false
}

const prepareUpdate = (user: User) : void => {
  delete user.userName
  delete user._id
  delete user.created
  user.updated = new Date()
}

const userDupeCheck = async (userName: string, email: string): Promise<boolean> => {
  const dupQuery: IUserDupeFilter = { $or: [{ userName }, { email }] }
  const checkDup = await UserDB.getUserByQuery(dupQuery)
  if (checkDup?.userName === userName) throw new MongoDBError(`Create user failure, user with userName: ${userName} already exists`)
  if (checkDup?.email === email) throw new MongoDBError(`Create user failure, user with email: ${email} already exists`)
  return false
}

export {
  userFullName,
  isUser,
  userDupeCheck,
  prepareUpdate
}