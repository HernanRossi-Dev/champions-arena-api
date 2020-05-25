class ProcessError extends Error {
  name: string
  date: Date
  message: string
  status: number

  constructor(message='Could not process request!') {
    super()
    this.name = "ProcessError"
    this.date = new Date()
    this.message = message
    this.status = 200
  }
}

export default ProcessError