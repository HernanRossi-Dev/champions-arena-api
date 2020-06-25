import { Router } from 'express'
import { jwtCheck } from '../services'
import { JoiSchemas,joiValidation } from '../../models/request-validation'
import {UserController} from '../controllers'

const router = Router()

router.get('/:_id', joiValidation(JoiSchemas.findById, 'params'), UserController.getUserParam)

router.post('/', joiValidation(JoiSchemas.postUser, 'body'), UserController.postUser)

router.use(jwtCheck)

router.get('/', joiValidation(JoiSchemas.fetchUserByQuery, 'query'), UserController.getUserQuery)

router.put('/', joiValidation(JoiSchemas.updateUser, 'body'), UserController.putUser)

router.delete('/', joiValidation(JoiSchemas.deleteUserQuery, 'query'), UserController.deleteUserByQuery)

export default router