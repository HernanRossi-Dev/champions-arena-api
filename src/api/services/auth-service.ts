import jwks from 'jwks-rsa'
import jwt from 'express-jwt'
import request from 'request'
import config from 'config'
import { Request, Response } from 'express'
import { validateUser } from '../../utils'
import { AuthError } from '../../errors'

const authenticate = async (email: string, password: string) => {
  const clientSecret = process.env.CLIENT_SECRET
  const clientId = process.env.CLIENT_ID
  const authURL = process.env.AUTH_URL || ''
  const body = `{"client_id":"${clientId}","client_secret":"${clientSecret}","audience":"${config.get("auth0.audience")}","grant_type":"client_credentials"}`
  const options = {
    method: 'POST',
    url: authURL,
    headers: { 'content-type': 'application/json' },
    body
  }
  const isValid = await validateUser(email, password)
  if (!isValid) {
    throw new AuthError('Failed to validate credentials.')
  }
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const parsedBody = JSON.parse(body)
        resolve(parsedBody)
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

export {
  authenticate,
  authError,
  jwtCheck
}