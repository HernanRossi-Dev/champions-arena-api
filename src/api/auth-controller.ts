import express, { Response, Request } from 'express'
import { authenticate } from '../services/auth-service'
import { logger } from '../utils';
const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
  const email = req.body.email?.toString()
  const password = req.body.password?.toString()
  if (!email || !password) {
    logger.error({ message: `Authentication failed, must provide email and password.` })
    res.status(401).json({ message: 'Authentication failed, must provide email and password.' })
  }
  let response
  try {
    response = await authenticate(email, password)
  } catch (err) {
    logger.error({ message: `Failed to authenticate user.`, error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
  logger.debug({ message: `Authentication success. ${email}` })
  res.status(200).json(response)
});

export default router