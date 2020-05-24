import mongoose from 'mongoose'
import { logger } from './index'

let db: mongoose.Connection

const getMongoConnection = async (): Promise<mongoose.Connection> => {

  const dbUrl: string = process.env.MONGODB_URL || ''
  const mongoClient = await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  db = mongoClient.connection
  db.on('error', console.error.bind(logger.error, 'MongoDB connection error!'))
  logger.debug({ message: 'New database connection made.' })
  return db
}

export { getMongoConnection }