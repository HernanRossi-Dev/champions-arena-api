import { QueryFindOptions } from "mongoose"

interface IUserFilterType extends QueryFindOptions {
  userName?: string
  firstName?: string
  lastName?: string
  email?: string
  _id?: string
}

interface IUserDupeFilter extends QueryFindOptions { 
  $or: [ { userName: string }, { email: string} ]
}
export {
  IUserFilterType,
  IUserDupeFilter
}