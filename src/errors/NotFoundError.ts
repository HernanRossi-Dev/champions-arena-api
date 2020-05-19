class NotFoundError extends Error {
  name: string
  date: Date
  message: string
  status: number

  constructor() {
    super()
    this.name = "NotFoundError"
    this.date = new Date()
    this.message = 'Data not found in MongoDB'
    this.status = 404
  }
}

export default NotFoundError