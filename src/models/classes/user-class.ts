import { IUser } from '../interfaces'
import { ObjectID } from "mongodb";
import bcrypt from 'bcrypt'

export class User implements IUser {
  userName: string
  firstName: string
  lastName?: string
  _id: ObjectID
  created: Date
  updated?: Date
  email: string
  password?: string
  isGuest?: boolean

  constructor(user: IUser) {
    this.userName = user.userName
    this.firstName = user.firstName
    this.lastName = user.lastName || ''
    this._id = user._id || new ObjectID()
    this.created = user.created || new Date()
    this.updated = user.updated
    this.email = user.email
    this.password = user.password
    this.isGuest = user.isGuest || false
  }

  public getProperties(): IUser {
    return {
      userName: this.userName,
      firstName: this.firstName,
      lastName: this.lastName,
      _id: this._id,
      created: this.created,
      updated: this.updated,
      email: this.email,
      password: this.password,
      isGuest: this.isGuest
    }
  }

  public async setInsertValues(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10)
  }
}