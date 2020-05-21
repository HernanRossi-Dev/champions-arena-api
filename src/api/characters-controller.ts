import { Request, Response, Router } from 'express'
import mongodb from 'mongodb'
import CharacterService from '../services/character-service'
import AuthServices from '../services/auth-service'
import { ActionResult, CharQueryType } from '../models'

const ObjectId = mongodb.ObjectID
const router = Router()

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  if (!ObjectId.isValid(id)) {
    return res.status(422).send(`Invalid character id format: ${id}`)
  }

  try {
    const result: ActionResult = await CharacterService.getCharacter(id)
    res.status(200).json({data: result.data, message: result.message, errors: result.errors})
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error: ${err.message}` })
  }
})

router.get('/', async (req: Request, res: Response) => {
  const query = <CharQueryType>req.query
  try {
    const result: ActionResult = await CharacterService.getCharacters(query)
    res.status(200).json({data: result.data, message: result.message, errors: result.errors})
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error: ${err.message}` })
  }
})

router.use(AuthServices.jwtCheck)

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const { character } = req.body
  if (!ObjectId.isValid(id)) {
    return res.status(422).send(`Invalid character id format: ${id}`)
  }

  try {
    const result: ActionResult = await CharacterService.updateCharacter(id, character)
    res.status(200).json({data: result.data, message: result.message, errors: result.errors})
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error: ${err.message}` })
  }
})

router.post('/', async (req: Request, res: Response) => {
  const { character } = req.body
  try {
    const result: ActionResult = await CharacterService.createCharacter(character)
    res.status(200).json({data: result.data, message: result.message, errors: result.errors})
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error: ${err.message}` })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  if (!ObjectId.isValid(id)) {
    return res.status(422).send(`Invalid character id format: ${id}`)
  }

  try {
    const result: ActionResult = await CharacterService.deleteCharacter(id)
    res.status(200).json({data: result.data, message: result.message, errors: result.errors})
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error: ${err.message}` })
  }
})

router.delete('/', async (req: Request, res: Response) => {
  const query = <CharQueryType>req.query
  try {
    const result: ActionResult = await CharacterService.deleteCharacters(query)
    res.status(200).json({data: result.data, message: result.message, errors: result.errors})
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error: ${err.messagerr}` })
  }
})

export default router