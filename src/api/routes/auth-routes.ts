import express from 'express'
import { AuthController } from '../controllers'
import { JoiSchemas, joiValidation } from '../../models/request-validation'
const router = express.Router()

router.post('/', joiValidation(JoiSchemas.requestAuth0Token, 'body'), AuthController.requestAuth0Token);

export default router