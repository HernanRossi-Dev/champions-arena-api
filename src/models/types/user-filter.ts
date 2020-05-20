import { ObjectID } from "mongodb"

type UserFilterType = {
  name?: string,
  email?: string,
  _id?: string | ObjectID
}

export default UserFilterType