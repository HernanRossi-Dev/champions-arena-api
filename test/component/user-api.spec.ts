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
let userName: string, testEmail: string, firstName: string,
  lastName: string, testId: ObjectID, testPassword: string, token: string

describe('Users-API', () => {

  beforeAll(async () => {
    jest.setTimeout(6000)
    const res = await request(server).post(`/api/authenticate/`)
      .send({ email: faker.internet.email(), password: faker.lorem.sentence() })
    token = res.body.access_token
    userName = faker.name.firstName()
    firstName = userName
    testEmail = faker.internet.email()
    lastName = faker.name.lastName()
    testPassword = faker.lorem.sentence()
    const userPayload = {
      userName,
      email: testEmail,
      firstName: userName,
      lastName,
      password: testPassword,
      isGuest: false,
    }
    const result = await request(server).post(`/api/users`)
      .set('authorization', 'Bearer ' + token)
      .send(userPayload)
  })

  afterAll(async () => {
    await clearDB()
    await closeDB()
    server.close()
    jest.clearAllMocks()
    jest.resetModules()
  })

  describe('Get User by id param, ', () => {
    it('should respond status 200: /api/users/:id', async () => {
      const id = new ObjectID()
      const res = await request(server).get(`/api/users/${id}`)
      expect(res.status).toEqual(200)
      expect(res.body.status).toEqual('Processed')
      expect(res.body.data).toEqual({})
      expect(res.body.message).toEqual(`Get user failed: ${id}`)
      expect(res.body.errors.length).toBeGreaterThan(0)
    })

    it('should respond status 200: /api/users/:id', async () => {
      const id = new ObjectID()
      const res = await request(server).get(`/api/users/${id}`)
      expect(res.status).toEqual(200)
      expect(res.body.status).toEqual('Processed')
      expect(res.body.data).toEqual({})
      expect(res.body.message).toEqual(`Get user failed: ${id}`)
      expect(res.body.errors.length).toBeGreaterThan(0)
    })
  })

  describe('Get User: ', () => {
    it('by email should response status 200 and return object', async () => {
      const res = await request(server).get(`/api/users`)
        .set('authorization', 'Bearer ' + token)
        .query({ userName })
      expect(res.status).toEqual(200)
      expect(res.body.status).toEqual('Processed')
      const userResult = res.body.data
      expect(userResult.userName).toEqual(userName)
      expect(userResult.email).toEqual(testEmail)
      expect(res.body.errors.length).toBe(0)
    })
  })
})