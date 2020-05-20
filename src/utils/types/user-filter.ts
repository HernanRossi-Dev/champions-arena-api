import { ObjectID } from "mongodb"

type UserFilter = {
  name?: string,
  email?: string,
  _id?: string | ObjectID
}

export default UserFilter