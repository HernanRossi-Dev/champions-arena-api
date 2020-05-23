class NotFoundError extends Error {
  name: string
  date: Date
  message: string
  status: number

  constructor(message = 'Data not found in database.') {
    super()
    this.name = "NotFoundError"
    this.date = new Date()
    this.message = message
    this.status = 404
  }
}

export default NotFoundError