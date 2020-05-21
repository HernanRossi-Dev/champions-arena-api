class AuthError extends Error {
    name: string
    date: Date
    message: string
    status: number
  
    constructor(message?: string) {
      super()
      this.name = "AuthError"
      this.date = new Date()
      this.message = message || 'Authentication error!'
      this.status = 401
    }
  }
  
  export default AuthError