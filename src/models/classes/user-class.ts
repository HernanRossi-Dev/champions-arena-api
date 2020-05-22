import { IUser } from '../interfaces'
import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt'

export class User implements IUser {
  userName: string
  firstName: string
  lastName?: string
  _id: ObjectId
  created?: Date
  updated?: Date
  email: string
  password?: string
  isGuest?: boolean

  constructor(user: IUser) {
    this.userName = user.userName
    this.firstName = user.firstName
    this.lastName = user.lastName || ''
    this._id = user._id || new ObjectId()
    this.created = user.created
    this.updated = user.updated
    this.email = user.email
    this.password = user.password
    this.isGuest = user.isGuest
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
    this.created = new Date()
    this._id = new ObjectId()
    this.password = await bcrypt.hash(this.password, 10)
  }
}