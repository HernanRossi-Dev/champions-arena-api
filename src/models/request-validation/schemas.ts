import Joi from '@hapi/joi'

const objectIdRegex = /^[a-f\d]{24}$/i
const passwordRegex = /^[a-zA-Z0-9]{3,30}$/

export const postUser = Joi.object({
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().optional(),
  isGuest: Joi.boolean().optional(),
  _id: Joi.string().regex(objectIdRegex).optional(),
  password: Joi.string().regex(passwordRegex).required()
})

export const updateUser = Joi.object({
  _id: Joi.string().regex(objectIdRegex).required(),
  userName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  isGuest: Joi.boolean().optional(),
  password: Joi.string().regex(passwordRegex).optional()
}).or('userName', 'email')

export const findById = Joi.object({
  _id: Joi.string().regex(objectIdRegex).required(),
})

export const fetchUserByQuery = Joi.object({
  userName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  sendEmail: Joi.boolean().optional(),
}).or('userName', 'email')

export const deleteUserQuery = Joi.object({
  userName: Joi.string().required(),
  _id: Joi.string().regex(objectIdRegex).required(),
  deleteCharacters: Joi.boolean().optional()
})

export const postCharacter = Joi.object({
  userName: Joi.string().required(),
  basics: Joi.object({
    name: Joi.string().required()
  }).unknown().required(),
  classProps: Joi.object().required(),
  ancestryProps: Joi.object().required(),
  backgroundProps: Joi.object().required(),
  modifiers: Joi.object().required(),
  mainStats: Joi.object().required(),
  actions: Joi.object().optional(),
  items: Joi.object().optional(),
  appearance: Joi.object().optional(),
  characterTraits: Joi.object().optional(),
  characterNotes: Joi.object().optional(),
  skillsModifiers: Joi.object().optional(),
  skillFeats: Joi.array().optional(),
  spells: Joi.object().optional(),
  feats: Joi.object().optional(),
  deleted: Joi.number().optional(),
  created: Joi.date().optional(),
  updated: Joi.date().optional(),
  _id: Joi.string().regex(objectIdRegex).optional(),
})

export const updateCharacter = Joi.object({
  _id: Joi.string().regex(objectIdRegex).required(),
  userName: Joi.string().required(),
  basics: Joi.object({
    name: Joi.string().required()
  }).unknown().required(),
  classProps: Joi.object().required(),
  ancestryProps: Joi.object().required(),
  backgroundProps: Joi.object().required(),
  modifiers: Joi.object().required(),
  mainStats: Joi.object().required(),
  actions: Joi.object().optional(),
  items: Joi.object().optional(),
  appearance: Joi.object().optional(),
  characterTraits: Joi.object().optional(),
  characterNotes: Joi.object().optional(),
  skillsModifiers: Joi.object().optional(),
  skillFeats: Joi.array().optional(),
  spells: Joi.object().optional(),
  feats: Joi.object().optional(),
  deleted: Joi.number().optional(),
  created: Joi.date().optional(),
  updated: Joi.date().optional(),
})

export const fetchCharacterByQuery = Joi.object({
  userName: Joi.string().required(),
  name: Joi.string().optional(),
  ancestry: Joi.string().optional(),
  class: Joi.boolean().optional(),
  level_lte: Joi.number().optional(),
  level_gte: Joi.number().optional(),
})

export const deleteCharacterQuery = Joi.object({
  userName: Joi.string().required(),
  _id: Joi.string().regex(objectIdRegex).required(),
})

export const requestAuth0Token = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().regex(passwordRegex).required()
})