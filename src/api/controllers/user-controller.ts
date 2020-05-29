import { ObjectID } from 'mongodb'
import { Request, Response } from 'express'
import { UserService } from '../services'
import { ActionResult, IUserQueryType, User } from '../../models'
import { logger } from '../../utils'
import { DeleteUserQueryT } from '../../models/types'

export const getUserParam = async (req: Request, res: Response) => {
  try {
    const _id = new ObjectID(req.params._id)
    const result: ActionResult = await UserService.getUserById(_id)
    logger.debug({ message: 'Retrieve user success', data: result })
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Retrieve user failure', error: err.message, name: err.name, stack: err.stack })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
}

export const getUserQuery = async (req: Request, res: Response) => {
  try {
    const query = <IUserQueryType>req.query
    const result: ActionResult = await UserService.getUserByQuery(query)
    logger.debug({ message: 'Retrieve user success', data: result })
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Retrieve user failure', error: err.message, name: err.name, stack: err.stack })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
}

export const postUser = async (req: Request, res: Response) => {
  try {
    const user: User = new User(req.body)
    const result: ActionResult = await UserService.createUser(user)
    logger.debug({ message: 'Post user success', data: result })
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Post user failure.', error: err.message, name: err.name, stack: err.stack })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
}

export const putUser = async (req: Request, res: Response) => {
  try {
    const user: User = new User(req.body)
    const result: ActionResult = await UserService.updateUser(user)
    logger.debug({ message: 'Put user success', data: result })
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Put user failure.', error: err.message, name: err.name, stack: err.stack  })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
}

export const deleteUserByQuery = async (req: Request, res: Response) => {
  try {
    const query = <DeleteUserQueryT>req.query
    const result: ActionResult = await UserService.deleteUser(query)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Delete user failure.', error: err.message, name: err.name, stack: err.stack })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
}
