import { ObjectID } from "mongodb"

export default interface IUser {
  firstName: string
  lastName?: string
  _id: ObjectID | string
  created?: Date
  email: string
  password?: string
}