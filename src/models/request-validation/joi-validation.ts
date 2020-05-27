import { Request, Response, NextFunction } from 'express'
import { logger } from '../../utils'
import { ObjectSchema } from '@hapi/joi'

const joiValidation = (schema: ObjectSchema, property: 'body' | 'query' | 'params') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property])
    if (error) {
      logger.error({ message: 'Joi validation error: ' + error })
      return res.status(422).json({ message: 'Joi validation error: ' + error })
    }
    next()
  }
}

export default joiValidation