import { IBase, IUser, ICharacter } from '../interfaces'
import { User, Character } from '.'

export interface IActionResult {
  message: string
  data: IBase
  status: string
  errors: Array<Error>
}

export default class ActionResult implements IActionResult {
  status: string
  errors: Error[]
  data: IBase
  message: string

  constructor(databaseResult: object, newMessage = '', error?: Error) {
    this.status = 'Processed Successfully'
    this.data = this.processData(databaseResult)
    this.message = newMessage
    this.errors = error ? [error] : []
  }

  private processData(data: object): IBase {
    if (this.isUser(data) ) {
      const user = new User(<IUser>data)
      delete user.password
      return user
    } else if (this.isCharacter(data)) {
      return new Character(<ICharacter>data)
    }
    return data
  }

  isUser = (data: object) => {
    if ((data as IUser).userName && (data as IUser).email) {
      return true
    }
    return false
  }

  isCharacter = (data: object) => {
    if ((data as ICharacter).userName && (data as ICharacter).basics.name) {
      return true
    }
    return false
  }

  setErrors(error: Error) {
    this.errors.push(error)
  }

  toJSON(): IActionResult {
    if (this.errors.length) {
      this.status = 'Processed with Errors'
    }
    return {
      data: this.data,
      message: this.message,
      status: this.status,
      errors: this.errors
    }
  }
}
