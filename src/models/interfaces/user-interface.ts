import { ObjectID } from "mongodb"
import { UnauthorizedError } from "express-jwt";

export default interface IUser {
  name: string
  _id?: ObjectID | string
  created?: Date
  email: string
}