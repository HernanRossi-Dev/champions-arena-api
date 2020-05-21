import express, { Response, Request } from 'express'
import AuthService from '../services/auth-service'
import { UserQueryType } from '../models';
const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const email = req.query.email?.toString()
  const password = req.query.password?.toString()
  if (!email || !password) {
    res.status(401).json({ message: 'Authentication failed, must provide email and password.' })
  }
  let response
  try {
    response = await AuthService.authenticate(email, password)
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed, please verify credentials.' })
  }
  res.status(200).json(response)
});

export default router