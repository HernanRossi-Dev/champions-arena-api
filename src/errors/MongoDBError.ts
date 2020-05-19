class MongoDBError extends Error {
  name: string
  date: Date
  message: string
  status: number

  constructor() {
    super()
    this.name = "MongoDBError"
    this.date = new Date()
    this.message = 'MongoDB encountered and error!'
    this.status = 422
  }
}

export default MongoDBError