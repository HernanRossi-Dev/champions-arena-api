import { QueryFindOptions } from "mongoose"
import { ObjectID } from "mongodb"

interface ICharFilter extends QueryFindOptions {
  userName?: string
  class?: string
  ancestry?: string
  level?: {
    $lte?: number,
    $gte?: number
  }
  name?: string
  _id?: ObjectID
}

export default ICharFilter