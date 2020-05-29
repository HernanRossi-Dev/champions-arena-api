import { Response, Request } from 'express'
import { authenticate } from '../services/auth-service'
import { logger } from '../../utils';

export const requestAuth0Token = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const response = await authenticate(email, password)
    logger.debug({ message: `Authentication success. ${email}` })
    res.status(200).json(response)
  } catch (err) {
    logger.error({ message: `Failed to authenticate user.`, error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
}
