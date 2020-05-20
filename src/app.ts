import express from 'express'
import bodyParser from 'body-parser'
import SourceMapSupport from 'source-map-support'
import cors from 'cors'
import helmet from 'helmet'
import { CharacterRoutes, UserRoutes, AuthRoutes } from './api'
import { getMongoConnection } from './utils'

SourceMapSupport.install()

const app = express()
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api/authenticate', AuthRoutes)
app.use('/api/characters', CharacterRoutes)
app.use('/api/users', UserRoutes)

const initServer = () => {
  app.listen(process.env.PORT || 8080, () => {
    console.log('App started on port 8080.')
  })
}

const initMongoDB = async () => {
  try {
    await getMongoConnection()
  } catch(err) {
    console.error('Failed to connect to mongodb.')
  }
}
initMongoDB()
initServer()

export default app