import jwks from 'jwks-rsa'
import jwt from 'express-jwt'
import request from 'request'
import { Request, Response } from 'express'

const authenticate = async () => {
  const options = { method: 'POST',
  url: 'https://dev-qf368xa5.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: '{"client_id":"D9Q8oFzgxOvpCTCFxR0mNGZJ9x6sgzq5","client_secret":"faeq5zuIcrZ4EwJskdVQ_c4tx33vsbh-qDtYqLVuC8RbmrK3CakNr8bvBRpBVc3N","audience":"champions-arena","grant_type":"client_credentials"}' }

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(body)
      } else {
        reject(error)
      }
    })
  })
}

const authError = (err: Error, req: Request, res: Response) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Missing or invalid token. Please logout And log back in.' })
  }
}

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://dev-qf368xa5.auth0.com/.well-known/jwks.json'
    }),
    audience: 'champions-arena',
    issuer: 'https://dev-qf368xa5.auth0.com/',
    algorithms: ['RS256']
})


export default {
  authenticate,
  authError,
  jwtCheck
}