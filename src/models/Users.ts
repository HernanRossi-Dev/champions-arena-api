import { Document, model, Model, Schema } from 'mongoose'

const UserSchema: Schema = new Schema({
  userName: String,
  password: String,
  email: String,
})

export interface IUser extends Document {
  userName: string
  password: string
  email: string
}

export const UserModel: Model<IUser> = model<IUser>('users', UserSchema)
