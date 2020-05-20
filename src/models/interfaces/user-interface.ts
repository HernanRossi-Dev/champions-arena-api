import { ObjectID } from "mongodb"

export default interface IUser {
  name: string
  _id?: ObjectID | string
  created?: Date
  email: string
}