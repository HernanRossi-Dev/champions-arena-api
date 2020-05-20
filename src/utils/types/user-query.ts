import { ObjectID } from "mongodb"

type UserQuery = {
  sendEmail?: boolean | string
  name?: string
  email?: string
  _id?: string | ObjectID
}

export default UserQuery