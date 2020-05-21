import express from 'express'
import UserService from '../services/user-service'
import AuthServices from '../services/auth-service'
import mongodb from 'mongodb'
import { Request, Response, Router } from 'express'
import { ActionResult, IUserQueryType, IUser } from '../models'
import { logger } from '../utils'

const ObjectId = mongodb.ObjectID
const router = Router()

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  if (!ObjectId.isValid(id)) {
    return res.status(422).send(`Invalid user id format: ${id}`)
  }
  try {
    const result: ActionResult = await UserService.getUserById(id)
    logger.debug({ message: 'Retrieve character success', data: result })
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Retrieve character failure', error: err.message, stacktrace: err.stacktrace })
    res.status(500).json({ message: `Internal Server Error: ${err.message}` })
  }
})

router.use(AuthServices.jwtCheck)

router.get('/', async (req: Request, res: Response) => {
  const query = <IUserQueryType>req.query
  try {
    const result: ActionResult = await UserService.getUserDetails(query)
    logger.debug({ message: 'Retrieve character success', data: result })
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Retrieve character failure', error: err.message, stacktrace: err.stacktrace })
    res.status(500).json({ message: `Internal Server Error: ${err.message}` })
  }
})

router.post('/', async (req: Request, res: Response) => {
  const user: IUser = req.body
  try {
    const result: ActionResult = await UserService.createUser(user)
    logger.debug({ message: 'Post character success', data: result })
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Post character failure.', error: err.message, stacktrace: err.stacktrace })
    res.status(500).json({ message: `Internal Server Error: ${err.message}` })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const user: IUser = req.body
  if (!ObjectId.isValid(id)) {
    logger.error({ message: `Invalid user id format: ${id}.` })
    return res.status(422).send(`Invalid user id format: ${id}`)
  }
  try {
    const result: ActionResult = await UserService.updateUser(id, user)
    logger.debug({ message: 'Put character success', data: result })
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Put character failure.', error: err.message, stacktrace: err.stacktrace })
    res.status(500).json({ message: `Internal Server Error: ${err.message}` })
  }
})

router.delete('/:userName', async (req: Request, res: Response) => {
  const { userName } = req.params
  try {
    const result: ActionResult = await UserService.deleteUser(userName)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Delete character failure.', error: err.message, stacktrace: err.stacktrace })
    res.status(500).json({ message: `Internal Server Error: ${err.message}` })
  }
})

export default router