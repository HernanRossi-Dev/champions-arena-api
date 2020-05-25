import { inMemoryDB, clearDB, closeDB } from '../database-helper'
jest.mock('../../src/utils/mongo-connection', () => ({
  getMongoConnection: jest.fn().mockImplementation(() => inMemoryDB())
}))
jest.mock('../../src/utils/logger', () => ({
  error: jest.fn().mockImplementation(() => { }),
  debug: jest.fn().mockImplementation(() => { })
}))
jest.mock('../../src/utils/auth-utils', () => ({
  validateUser: jest.fn().mockImplementation(() => { return true }),
}))
jest.mock('../../src/utils/user-utils', () => ({
  userDupeCheck: jest.fn().mockImplementation(() => { return false }),
  isUser: jest.fn().mockImplementation(() => { return true }),
}))

import faker from 'faker'
import request from "supertest"
import { ObjectID } from 'mongodb'
import server from '../../src/server'
import CreateCharacterMock from '../mocks/create-character-mock'
import { ICharacter } from '../../src/models'
let newCharacter: ICharacter, token: string

describe('Characters-API', () => {

  beforeAll(async () => {
    jest.setTimeout(6000)
    const res = await request(server).post(`/api/authenticate/`)
      .send({ email: faker.internet.email(), password: faker.lorem.sentence() })
    token = res.body.access_token

    const characterPayload = CreateCharacterMock()
    console.log('New HCAR: ', characterPayload)
    const result = await request(server).post(`/api/characters`)
      .set('authorization', 'Bearer ' + token)
      .send({ data: characterPayload })
    console.log('Create char result', result.body)
  })

  afterAll(async () => {
    await clearDB()
    await closeDB()
    server.close()
    jest.clearAllMocks()
    jest.resetModules()
  })

  describe('Get Character by id param, ', () => {
    it('should respond status 200: /api/characters/:id', async () => {
      const id = new ObjectID()
      const res = await request(server).get(`/api/characters/${id}`)
      expect(res.status).toEqual(200)
      expect(res.body.status).toEqual('Processed')
      expect(res.body.data).toEqual({})
      expect(res.body.message).toEqual(`Get character failed: ${id}`)
      expect(res.body.errors.length).toBeGreaterThan(0)
    })

    it('should respond status 200: /api/characters/:id', async () => {
      const id = new ObjectID()
      const res = await request(server).get(`/api/characters/${id}`)
      expect(res.status).toEqual(200)
      expect(res.body.status).toEqual('Processed')
      expect(res.body.data).toEqual({})
      expect(res.body.message).toEqual(`Get character failed: ${id}`)
      expect(res.body.errors.length).toBeGreaterThan(0)
    })
  })

  describe('Get Character by query: ', () => {
    it('by email should response status 200 and return object', async () => {
      const res = await request(server).get(`/api/characters`)
        .set('authorization', 'Bearer ' + token)
        .query({ user: newCharacter.user })
      console.log("GEt char result:", res.body)
      expect(res.status).toEqual(200)
      expect(res.body.status).toEqual('Processed')
      const userResult = res.body.data
      expect(res.body.errors.length).toBe(0)
    })
  })
})