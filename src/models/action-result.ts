import { isUser } from '../utils/user-utils'
import { IBase, IUser, ICharacter } from './interfaces'
import { User, Character } from '.'
import { isCharacter } from '../utils'

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
    this.status = 'Processed'
    this.data = this.processData(databaseResult)
    this.message = newMessage
    this.errors = error ? [error] : []
  }

  private processData(data: object ): IBase {
    
    if (isUser(data)) {
      const user = new User(<IUser>data)
      delete user.password
      return user
    }else if (isCharacter(data)) {
      return new Character(<ICharacter>data)
    }
    return data
  }

  setErrors(error: Error) {
    this.errors.push(error)
  }

  toJSON(): IActionResult {
    return {
      data: this.data,
      message: this.message,
      status: this.status,
      errors: this.errors
    }
  }
}
