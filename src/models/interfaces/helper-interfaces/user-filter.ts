import { QueryFindOptions } from "mongoose"

interface IUserFilter extends QueryFindOptions {
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
  IUserFilter,
  IUserDupeFilter
}