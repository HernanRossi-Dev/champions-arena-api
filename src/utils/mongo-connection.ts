import config from 'config'
import mongoose from 'mongoose'
import { logger } from './index'

let mongoConnection: mongoose.Connection

const getMongoConnection = async () => {
  if (mongoConnection) {
    return mongoConnection
  }

  const dbUrl: string = <string>process.env.MONGODBURL
  const mongoClient = await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  mongoConnection = mongoClient.connection
  mongoConnection.on('error', console.error.bind(console, 'MongoDB connection error!'))
  return mongoConnection
}

export default getMongoConnection