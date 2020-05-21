import { isUser } from '../utils/user-utils'
import { IUser } from './interfaces'
export default class ActionResult {
  private _status: string
  private _errors: Error[]
  private _data: object
  private _message: string

  constructor(databaseResult: object, message: string = '', error?: Error) {
    this._status = 'Processed'
    this._data = this.processData(databaseResult)
    this._message = message
    this._errors = error ? [error] : []
  }

  private processData(databaseResult: object) {
    if (isUser(databaseResult)) {
      const userObj = <IUser>databaseResult
      userObj.password = undefined
      return userObj
    }
    return databaseResult
  }

  get data(): object {
    return this._data
  }

  set data(newData) {
    this._data = newData
  }

  get errors(): Error[] {
    return this._errors
  }

  setErrors(error: Error) {
    this._errors.push(error)
  }

  get message(): string {
    return this._message
  }

  get status(): string {
    return this._status
  }

  set status(status: string) {
    this._status = status
  }
}
