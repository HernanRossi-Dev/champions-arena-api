import { IUser } from '../models'

const userFullName = (user: IUser): string => {
  return user.firstName + ' ' + user.lastName
}

const isUser = (data: object): boolean => {
  if((data as IUser).userName && (data as IUser).email){
    return true
  }
  return false
}

export {
  userFullName,
  isUser
}