import config from 'config'
import mongoose from 'mongoose'

let mongoConnection: mongoose.Connection

const getMongoConnection = async () => {
  if (mongoConnection) {
    return mongoConnection
  }

  console.log("Creating new connection to DB.")
  const dbUrl: string = config.get('mongoDBUrl')
  const mongoClient = await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  mongoConnection = mongoClient.connection
  mongoConnection.on('error', console.error.bind(console, 'MongoDB connection error!'))
  return mongoConnection
}

export default getMongoConnection