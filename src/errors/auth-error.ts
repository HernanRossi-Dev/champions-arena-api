class AuthError extends Error {
    name: string
    date: Date
    message: string
    status: number
  
    constructor(message='Authentication error!') {
      super()
      this.name = "AuthError"
      this.date = new Date()
      this.message = message
      this.status = 401
    }
  }
  
  export default AuthError