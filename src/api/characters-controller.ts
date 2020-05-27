import { Request, Response, Router } from 'express'
import mongodb, { ObjectID } from 'mongodb'
import { CharacterService, jwtCheck } from '../services'
import { ActionResult, CharQueryT, Character } from '../models'
import { logger } from '../utils'
import { JoiSchemas, joiValidation } from '../models/request-validation'

const ObjectId = mongodb.ObjectID
const router = Router()

router.get('/:_id', joiValidation(JoiSchemas.findById, 'params'), async (req: Request, res: Response) => {
  try {
    const searchId = new ObjectID(req.params._id)
    const result: ActionResult = await CharacterService.getCharacterById(searchId)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Get character by _id failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.use(jwtCheck)

router.get('/', joiValidation(JoiSchemas.fetchCharacterByQuery, 'query'), async (req: Request, res: Response) => {
  try {
    const query = <CharQueryT>req.query
    const result: ActionResult = await CharacterService.getCharacterByFilter(query)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Get character by query failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.post('/', joiValidation(JoiSchemas.postCharacter, 'body'), async (req: Request, res: Response) => {
  try {
    const character: Character = new Character(req.body)
    const result: ActionResult = await CharacterService.createCharacter(character)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Post character failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.put('/', joiValidation(JoiSchemas.updateCharacter, 'body'), async (req: Request, res: Response) => {
  try {
    const character: Character = new Character(req.body)
    const result: ActionResult = await CharacterService.updateCharacter(character)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Put character failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.delete('/:_id', joiValidation(JoiSchemas.findById, 'params'), async (req: Request, res: Response) => {
  try {
    const searchId = new ObjectID(req.params._id)
    const result: ActionResult = await CharacterService.deleteCharacter(searchId)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Delete character by _id failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.delete('/', joiValidation(JoiSchemas.deleteCharacterQuery, 'params'), async (req: Request, res: Response) => {
  try {
    const query: CharQueryT = <CharQueryT>req.query
    const result: ActionResult = await CharacterService.deleteCharacters(query)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Delete characters failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

export default router