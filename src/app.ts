import express from 'express'
import SourceMapSupport from 'source-map-support'
import cors from 'cors'
import helmet from 'helmet'
import { CharacterRoutes, UserRoutes, AuthRoutes } from './api'
import { logger, getMongoConnection } from './utils'

SourceMapSupport.install()

const app: express.Express = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use('/api/authenticate', AuthRoutes)
app.use('/api/characters', CharacterRoutes)
app.use('/api/users', UserRoutes)

const initDepenencies = async () => {
  try {
    await getMongoConnection()
  } catch (err) {
    logger.error({
      message: "Failed to connect to Mongodb server.",
      error: err.message,
      stacktrace: err.stacktrace
    })
    //Don't initialize app if no database connection
    process.exit(1);
  }
}

initDepenencies()

export default app