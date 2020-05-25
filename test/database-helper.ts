import mongoose, { Mongoose } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const mongod = new MongoMemoryServer()
let client: Mongoose
const inMemoryDB = async () => {
  if (client) return client
  const url = await mongod.getConnectionString()

  const options = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  }

  client = await mongoose.connect(url, options)
  console.log("returning in memory database")
  
  return client.connection
}

const closeDB = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongod.stop()
}

const clearDB = async () => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
}

export {
  inMemoryDB,
  closeDB,
  clearDB
}