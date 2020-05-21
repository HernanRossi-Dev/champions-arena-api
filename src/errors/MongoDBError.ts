class MongoDBError extends Error {
  name: string
  date: Date
  message: string
  status: number

  constructor(message?: string) {
    super()
    this.name = "MongoDBError"
    this.date = new Date()
    this.message = message || 'MongoDB encountered and error!'
    this.status = 422
  }
}

export default MongoDBError