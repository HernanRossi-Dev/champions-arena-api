import { Document, model, Model, Schema } from 'mongoose'
import { ObjectID } from 'mongodb'
import { IUser } from '../interfaces'

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: String,
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
})

UserSchema.statics.fullName = function() {
  return this.firstName + ' ' + this.lastName
}

export interface IUserModel extends IUser, Document {
  firstName: string
  lastName?: string
  password?: string
  _id: ObjectID | string
  email: string
  insertedId?: string
  created?: Date
}

export const UserModel: Model<IUserModel> = model<IUserModel>('users', UserSchema)
