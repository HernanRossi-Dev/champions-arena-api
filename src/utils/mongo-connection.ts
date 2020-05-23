import mongoose from 'mongoose'
import { logger } from './index'

let mongoConnection: mongoose.Connection

const getMongoConnection = async () => {
  if (mongoConnection) {
    return mongoConnection
  }

  const dbUrl: string = process.env.MONGODB_URL || ''
  const mongoClient = await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  mongoConnection = mongoClient.connection
  mongoConnection.on('error', console.error.bind(logger.error, 'MongoDB connection error!'))
  logger.debug({message: 'New database connection made.'})
  return mongoConnection
}

export default getMongoConnection