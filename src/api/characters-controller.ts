import { Request, Response, Router } from 'express'
import mongodb, { ObjectID } from 'mongodb'
import { CharacterService, jwtCheck } from '../services'
import { ActionResult, CharQueryType, Character } from '../models'
import { logger } from '../utils'

const ObjectId = mongodb.ObjectID
const router = Router()

router.get('/:_id', async (req: Request, res: Response) => {
  const _id = req.params?._id
  if (!ObjectId.isValid(_id)) return res.status(422).json({message: `Invalid character _id format.`})
  try {
    const objId = new ObjectID(_id)
    const result: ActionResult = await CharacterService.getCharacterById(objId)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Get character by _id failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.use(jwtCheck)

router.get('/', async (req: Request, res: Response) => {
  try {
    const query = <CharQueryType>req.query
    const result: ActionResult = await CharacterService.getCharacterByFilter(query)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Get character by query failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const character: Character = new Character(req.body.data)
    const result: ActionResult = await CharacterService.createCharacter(character)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Post character failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.put('/', async (req: Request, res: Response) => {
  try {
    const character: Character = new Character(req.body.data)
    const result: ActionResult = await CharacterService.updateCharacter(character)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Put character failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.delete('/:_id', async (req: Request, res: Response) => {
  const _id  = req.params?._id
  if (!ObjectId.isValid(_id)) return res.status(422).json({message: `Invalid character _id format: ${_id}`})
  try {
    const objId = new ObjectID(req.params._id)
    const result: ActionResult = await CharacterService.deleteCharacter(objId)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Delete character by _id failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.delete('/', async (req: Request, res: Response) => {
  const query = <CharQueryType>req?.query
  try {
    const result: ActionResult = await CharacterService.deleteCharacters(query)
    res.status(200).json(result.toJSON())
  } catch (err) {
    logger.error({ message: 'Delete characters failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

export default router