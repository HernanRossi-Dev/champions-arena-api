import { ObjectID } from "mongodb"

export interface IUserQueryType {
  userName?: string
  sendEmail?: boolean
  firstName?: string
  lastName?: string
  email?: string
  _id?: string
}

export type DeleteUserQueryT = {
  _id: ObjectID | string,
  userName: string,
  email?: string,
  deleteCharacters?: boolean
}
