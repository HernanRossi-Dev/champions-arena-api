import { IUser } from '../models'

const userFullName = (user: IUser): string => {
  return user.firstName + ' ' + user.lastName
}

export {
  userFullName
}