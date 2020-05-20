import { ObjectID } from "mongodb"

export default interface IUser {
  userName: string
  firstName: string
  lastName?: string
  _id: ObjectID | string
  created?: Date
  email: string
  password?: string
}