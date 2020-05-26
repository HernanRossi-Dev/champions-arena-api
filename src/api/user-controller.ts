import { UserService, jwtCheck } from '../services'
import { ObjectId } from 'mongodb'
import { Request, Response, Router } from 'express'
import { ActionResult, IUserQueryType, User } from '../models'
import { logger } from '../utils'

const router = Router()

router.get('/:_id', async (req: Request, res: Response) => {
  if (!ObjectId.isValid(req.params._id)) return res.status(422).send(`Invalid user _id format: ${req.params._id}`)

  try {
    const _id = new ObjectId(req.params._id)
    const result: ActionResult = await UserService.getUserById(_id)
    logger.debug({ message: 'Retrieve user success', data: result })
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Retrieve user failure', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.use(jwtCheck)

router.get('/', async (req: Request, res: Response) => {
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

router.post('/', async (req: Request, res: Response) => {
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

router.put('/', async (req: Request, res: Response) => {
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

router.delete('/', async (req: Request, res: Response) => {
  try {
    const userName: string = req.body?.userName
    if (!ObjectId.isValid(req.body?._id) || !userName){
      return res.status(422).send(`Must provide valid userName and id. ${req.body?.userName}, ${req.body?._id}`)
    }
    const _id: ObjectId = new ObjectId(req.body._id)
    const result: ActionResult = await UserService.deleteUser(_id, userName)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Delete user failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

export default router