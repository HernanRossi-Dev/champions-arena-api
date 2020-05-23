class MongoDBError extends Error {
  name: string
  date: Date
  message: string
  status: number

  constructor(message ='MongoDB encountered and error!') {
    super()
    this.name = "MongoDBError"
    this.date = new Date()
    this.message = message
    this.status = 422
  }
}

export default MongoDBError