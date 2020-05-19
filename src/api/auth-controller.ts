import express, { Response, Request } from 'express'
import AuthService from '../services/auth-service'
const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const response = await AuthService.authenticate()
  res.status(200).json(response)
});

export default router