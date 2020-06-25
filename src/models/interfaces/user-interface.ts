import IBase from './base-interface'

export default interface IUser extends IBase {
  userName: string
  firstName: string
  lastName?: string
  email: string
  password?: string
  isGuest: boolean
}