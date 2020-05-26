import { ObjectID } from "mongodb"

type CharQueryType = {
  userName: string
  name?: string
  class?: string
  ancestry?: string
  level_lte?: string
  level_gte?: string
  _id?: ObjectID
}

export default CharQueryType