import express from 'express'
import SourceMapSupport from 'source-map-support'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import { CharacterRoutes, UserRoutes, AuthRoutes } from './api'
import { logger, getMongoConnection } from './utils'

SourceMapSupport.install()

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use('/api/authenticate', AuthRoutes)
app.use('/api/characters', CharacterRoutes)
app.use('/api/users', UserRoutes)

const initServer = () => {
  app.listen(process.env.PORT || 8080, () => {
    logger.debug('Application started on port 8080.')
  })
}

const initDepenencies = async () => {
  try {
    await getMongoConnection()
  } catch (err) {
    logger.error({
      message: "Failed to connect to Mongodb server.",
      error: err.message,
      stacktrace: err.stacktrace
    })
  }
}

initDepenencies()
initServer()

export default app