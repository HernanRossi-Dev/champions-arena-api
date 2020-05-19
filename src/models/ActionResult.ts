export default class ActionResult {
  private _status: string
  private _errors: Error[]
  private _data: object
  private _message: string

  constructor(databaseResult: object, message: string = '', error?: Error) {
    this._status = 'Processed'
    this._data = databaseResult
    this._message = message
    this._errors = error ? [error] : []
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
