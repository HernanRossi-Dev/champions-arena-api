import { Router } from 'express'
import { jwtCheck } from '../services'
import * as CharacterControllers from '../controllers/characters-controller'
import { JoiSchemas, joiValidation } from '../../models/request-validation'

const router = Router()

router.get('/:_id', joiValidation(JoiSchemas.findById, 'params'), CharacterControllers.getCharacterParam)

router.use(jwtCheck)

router.get('/', joiValidation(JoiSchemas.fetchCharacterByQuery, 'query'), CharacterControllers.getCharacterQuery)

router.post('/', joiValidation(JoiSchemas.postCharacter, 'body'), CharacterControllers.postCharacter)

router.put('/', joiValidation(JoiSchemas.updateCharacter, 'body'), CharacterControllers.putCharacter)

router.delete('/:_id', joiValidation(JoiSchemas.findById, 'params'), CharacterControllers.deleteCharacterByParam)

router.delete('/', joiValidation(JoiSchemas.deleteCharacterQuery, 'query'), CharacterControllers.deleteCharacterByQuery)

export default router