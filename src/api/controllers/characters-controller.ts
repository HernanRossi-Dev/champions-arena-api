import { Request, Response } from 'express'
import { ObjectID } from 'mongodb'
import { CharacterService } from '../services'
import { ActionResult, CharQueryT, Character } from '../../models'
import { logger } from '../../utils'

export const getCharacterParam = async (req: Request, res: Response) => {
  try {
    const searchId = new ObjectID(req.params._id)
    const result: ActionResult = await CharacterService.getCharacterById(searchId)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Get character by _id failure.', error: err.message, name: err.name, stack: err.stack })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
}

export const getCharacterQuery = async (req: Request, res: Response) => {
  try {
    const query = <CharQueryT>req.query
    const result: ActionResult = await CharacterService.getCharacterByFilter(query)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Get character by query failure.', error: err.message, name: err.name, stack: err.stack })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
}

export const postCharacter = async (req: Request, res: Response) => {
  try {
    const character: Character = new Character(req.body)
    const result: ActionResult = await CharacterService.createCharacter(character)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Post character failure.', error: err.message, name: err.name, stack: err.stack })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
}

export const putCharacter = async (req: Request, res: Response) => {
  try {
    const character: Character = new Character(req.body)
    const result: ActionResult = await CharacterService.updateCharacter(character)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Put character failure.', error: err.message, name: err.name, stack: err.stack })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
}

export const deleteCharacterByParam = async (req: Request, res: Response) => {
  try {
    const searchId = new ObjectID(req.params._id)
    const result: ActionResult = await CharacterService.deleteCharacter(searchId)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Delete character by _id failure.', error: err.message, name: err.name, stack: err.stack })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
}

export const deleteCharacterByQuery = async (req: Request, res: Response) => {
  try {
    const query: CharQueryT = <CharQueryT>req.query
    const result: ActionResult = await CharacterService.deleteCharacters(query)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Delete characters failure.', error: err.message, name: err.name, stack: err.stack })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
}
