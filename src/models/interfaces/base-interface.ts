import { ObjectID } from "mongodb"

export default interface IBase {
  userName?: string
  _id?: ObjectID
  created?: Date
  updated?: Date
  modifiedCount?: number
  deletedCount?: number
}