import express, { Response, Request } from 'express'
import AuthService from '../services/auth-service'
const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const { email, password } = req.params
  const response = await AuthService.authenticate( email, password)
  if (!response) {
    res.status(401).json({ message: 'Failed to validate user please verify your credentials and try again.' })
  }
  res.status(200).json(response)
});

export default router