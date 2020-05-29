import { ObjectID } from "mongodb"

type CharQueryT = {
  userName?: string
  name?: string
  class?: string
  ancestry?: string
  level_lte?: number
  level_gte?: number
  _id?: ObjectID
}

export default CharQueryT