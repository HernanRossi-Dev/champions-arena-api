import { Request, Response, Router } from 'express'
import mongodb, { ObjectID } from 'mongodb'
import CharacterService from '../services/character-service'
import AuthServices from '../services/auth-service'
import { ActionResult, CharQueryType } from '../models'
import { logger } from '../utils'

const ObjectId = mongodb.ObjectID
const router = Router()

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  if (!ObjectId.isValid(id)) {
    return res.status(422).send(`Invalid character id format: ${id}`)
  }
  const objId = new ObjectID(req.params.id)

  try {
    const result: ActionResult = await CharacterService.getCharacter(objId)
    res.status(200).json({ data: result.data, message: result.message, errors: result.errors })
  } catch (err) {
    logger.error({ message: 'Get character by id failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.use(AuthServices.jwtCheck)

router.get('/', async (req: Request, res: Response) => {
  const query = <CharQueryType>req.query
  try {
    const result: ActionResult = await CharacterService.getCharacters(query)
    res.status(200).json({ data: result.data, message: result.message, errors: result.errors })
  } catch (err) {
    logger.error({ message: 'Get character by query failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.post('/', async (req: Request, res: Response) => {
  const { character } = req.body
  try {
    const result: ActionResult = await CharacterService.createCharacter(character)
    res.status(200).json({ data: result.data, message: result.message, errors: result.errors })
  } catch (err) {
    logger.error({ message: 'Post character failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  if (!ObjectId.isValid(id)) {
    return res.status(422).send(`Invalid character id format: ${id}`)
  }
  const objId = new ObjectID(req.params.id)
  const { character } = req.body
  try {
    const result: ActionResult = await CharacterService.updateCharacter(objId, character)
    res.status(200).json({ data: result.data, message: result.message, errors: result.errors })
  } catch (err) {
    logger.error({ message: 'Put character failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  if (!ObjectId.isValid(id)) {
    return res.status(422).send(`Invalid character id format: ${id}`)
  }
  const objId = new ObjectID(req.params.id)
  try {
    const result: ActionResult = await CharacterService.deleteCharacter(objId)
    res.status(200).json({ data: result.data, message: result.message, errors: result.errors })
  } catch (err) {
    logger.error({ message: 'Delete character by id failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

router.delete('/', async (req: Request, res: Response) => {
  const query = <CharQueryType>req.query
  try {
    const result: ActionResult = await CharacterService.deleteCharacters(query)
    res.status(200).json({ data: result.data, message: result.message, errors: result.errors })
  } catch (err) {
    logger.error({ message: 'Delete characters failure.', error: err.message, name: err.name })
    res.status(err.status || 500).json({ name: err.name, message: err.message })
  }
})

export default router