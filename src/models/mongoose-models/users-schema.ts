import { Document, model, Model, Schema } from 'mongoose'
import { ObjectID } from 'mongodb'

const UserSchema: Schema = new Schema({
  userName: String,
  password: String,
  email: String,
})

export interface IUserDoc extends Document {
  userName: string
  password: string
  email: string
  _id: ObjectID | string
  insertedId?: string
}

export const UserModel: Model<IUserDoc> = model<IUserDoc>('users', UserSchema)
