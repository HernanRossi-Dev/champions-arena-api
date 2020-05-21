import { IUser, ActionResult } from '../models'
import { IUserDupeFilter } from '../models/types'
import { UserDB } from '../data-access'

const userFullName = (user: IUser): string => {
  return user.firstName + ' ' + user.lastName
}

const isUser = (data: object): boolean => {
  if ((data as IUser).userName && (data as IUser).email) {
    return true
  }
  return false
}

const userDupeCheck = async (userName: string, email: string): Promise<ActionResult | boolean> => {
  const dupQuery: IUserDupeFilter = { $or: [{ userName }, { email }] }
  const checkDup = await UserDB.getUserDetails(dupQuery)
  if (checkDup?.userName === userName) {
    return new ActionResult({ userName }, 
      `Create user failure, user with userName: ${userName} already exists`)
  }
  if (checkDup?.email === email) {
    return new ActionResult({ email },
      `Create user failure, user with email: ${email} already exists`)
  }
  return false
}

export {
  userFullName,
  isUser,
  userDupeCheck
}