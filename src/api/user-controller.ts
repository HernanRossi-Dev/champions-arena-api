import { ObjectID } from 'mongodb'
import { Request, Response, Router } from 'express'
import { UserService, jwtCheck } from '../services'
import { ActionResult, IUserQueryType, User } from '../models'
import { logger } from '../utils'
import { JoiSchemas,joiValidation } from '../models/request-validation'
import { DeleteQueryT } from '../models/types'

const router = Router()

router.get('/:_id', joiValidation(JoiSchemas.findById, 'params'), async (req: Request, res: Response) => {
  try {
    const _id = new ObjectID(req.params._id)
    const result: ActionResult = await UserService.getUserById(_id)
    logger.debug({ message: 'Retrieve user success', data: result })
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Retrieve user failure', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.use(jwtCheck)

router.get('/', joiValidation(JoiSchemas.fetchUserByQuery, 'query'), async (req: Request, res: Response) => {
  try {
    const query = <IUserQueryType>req.query
    const result: ActionResult = await UserService.getUserByQuery(query)
    logger.debug({ message: 'Retrieve user success', data: result })
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Retrieve user failure', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.post('/', joiValidation(JoiSchemas.postUser, 'body'), async (req: Request, res: Response) => {
  try {
    const user: User = new User(req.body)
    const result: ActionResult = await UserService.createUser(user)
    logger.debug({ message: 'Post user success', data: result })
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Post user failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.put('/', joiValidation(JoiSchemas.updateUser, 'body'), async (req: Request, res: Response) => {
  try {
    const user: User = new User(req.body)
    const result: ActionResult = await UserService.updateUser(user)
    logger.debug({ message: 'Put user success', data: result })
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Put user failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.delete('/', joiValidation(JoiSchemas.deleteUserQuery, 'query'), async (req: Request, res: Response) => {
  try {
    const query = <DeleteQueryT>req.query
    const result: ActionResult = await UserService.deleteUser(query)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Delete user failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

export default router