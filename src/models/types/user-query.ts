import { ObjectID } from "mongodb"

type UserQueryType = {
  sendEmail?: boolean | string
  name?: string
  email?: string
  _id?: string | ObjectID
}

export default UserQueryType