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
let newCharacter: ICharacter, token: string, updateCharacter: ICharacter

describe('Characters-API', () => {
  beforeAll(async () => {
    jest.setTimeout(6000)
    const res = await request(server).post(`/api/authenticate/`)
      .send({ email: faker.internet.email(), password: faker.lorem.sentence() })
    token = res.body.access_token
  })

  afterAll(async () => {
    await clearDB()
    await closeDB()
    server.close()
    jest.clearAllMocks()
    jest.resetModules()
  })

  describe('Get Character Methods', () => {
    beforeAll(async () => {
      newCharacter = CreateCharacterMock()
      const result = await request(server).post(`/api/characters`)
        .set('authorization', 'Bearer ' + token)
        .send({ data: newCharacter })
      newCharacter._id = result.body?.data?._id
    })

    describe('Get Character by _id /api/characters/:_id, ', () => {
      it('should respond status 422 when invalid _id provided', async () => {
        const _id = 'notvalide!!@@!@!@!@!@!@!@!@'
        const res = await request(server).get(`/api/characters/${_id}`)
          .set('authorization', 'Bearer ' + token)
        expect(res.status).toEqual(422)
        expect(res.body).toHaveProperty('message')
        expect(res.body).not.toHaveProperty('data')
        expect(res.body.message).toBe(`Invalid character _id format: notvalide!!@@!@!@!@!@!@!@!@.`)
      })
      it('should respond status 200 when character not found', async () => {
        const _id = new ObjectID()
        const res = await request(server).get(`/api/characters/${_id}`)
        expect(res.status).toEqual(200)
        expect(res.body.status).toEqual('Processed')
        expect(res.body.data).toEqual({})
        expect(res.body.message).toEqual(`Get character failed: ${_id}.`)
        expect(res.body.errors.length).toBeGreaterThan(0)
      })

      it('should respond status 200 and return character if found.', async () => {
        const _id = newCharacter._id
        const res = await request(server).get(`/api/characters/${_id}`)
        expect(res.status).toEqual(200)
        expect(res.body.status).toEqual('Processed')
        const character = res.body.data
        expect(character).toHaveProperty('_id')
        expect(character).toHaveProperty('basics')
        expect(character.basics).toHaveProperty('name')
        expect(character).toHaveProperty('userName')
        expect(res.body.message).toEqual(`Get character success: ${_id}.`)
        expect(res.body.errors.length).toBe(0)
      })
    })

    describe('Get Character by query /api/characters/ ', () => {
      it('should respond status 200 if no character found', async () => {
        const fakename = 'This is a fake name'
        const res = await request(server).get(`/api/characters`)
          .set('authorization', 'Bearer ' + token)
          .query({ userName: fakename })
        expect(res.status).toEqual(200)
        expect(res.body.status).toEqual('Processed')
        expect(res.body.data.length).toEqual(0)
        expect(res.body.message).toEqual('Failed to fetch characters.')
        expect(res.body.errors.length).toBeGreaterThan(0)
      })

      it('by user should respond status 200 and return object', async () => {
        const _id = newCharacter._id
        const res = await request(server).get(`/api/characters`)
          .set('authorization', 'Bearer ' + token)
          .query({ userName: newCharacter.userName })
        expect(res.status).toEqual(200)
        expect(res.body.status).toEqual('Processed')
        expect(res.body.data.length).toEqual(1)
        const character = res.body.data[0]
        expect(character).toHaveProperty('_id')
        expect(character).toHaveProperty('_id')
        expect(character._id).toEqual(_id)
        expect(character.basics).toHaveProperty('name')
        expect(character).toHaveProperty('userName')
        expect(res.body.message).toEqual('Get characters success.')
        expect(res.body.errors.length).toBe(0)
      })
    })
  })

  describe('Post Character /api/characters/: ', () => {
    it('should respond status 200 and error when no data sent', async () => {
      const res = await request(server).post(`/api/characters`)
        .set('authorization', 'Bearer ' + token)
        .send({})
      expect(res.status).toEqual(200)
      expect(res.body).toHaveProperty('name')
      expect(res.body).toHaveProperty('message')
      expect(res.body).not.toHaveProperty('data')
      expect(res.body).not.toHaveProperty('status')
      expect(res.body.name).toBe('ProcessError')
      expect(res.body.message).toBe(`Character data must be provided.`)
    })

    it('should respond status 200 and return object', async () => {
      const res = await request(server).post(`/api/characters`)
        .set('authorization', 'Bearer ' + token)
        .send({ userName: 'Test name' })
      expect(res.status).toEqual(200)
      expect(res.body).toHaveProperty('data')
      expect(res.body.message).toBe('Create character success.')
      expect(res.body.status).toBe('Processed')
      expect(res.body.data.userName).toBe('Test name')
    })
    it('should respond status 200 and return object', async () => {
      const createCharacter = CreateCharacterMock()
      const res = await request(server).post(`/api/characters`)
        .set('authorization', 'Bearer ' + token)
        .send({ ...createCharacter })
      expect(res.status).toEqual(200)
      expect(res.body).toHaveProperty('data')
      expect(res.body.message).toBe('Create character success.')
      expect(res.body.status).toBe('Processed')
      expect(res.body.data.userName).toBe(createCharacter.userName)
    })
  })

  describe('Update Character', () => {
    beforeAll(async () => {
      updateCharacter = CreateCharacterMock()
      const result = await request(server).post(`/api/characters`)
        .set('authorization', 'Bearer ' + token)
        .send({  ...newCharacter })
      updateCharacter._id = result?.body?.data?._id
    })

    describe('Update Character put /api/characters/, ', () => {
      it('should respond status 200 when character not found', async () => {
        const res = await request(server).put(`/api/characters/`)
          .set('authorization', 'Bearer ' + token)
          .send({})
        expect(res.status).toEqual(200)
        expect(res.body).toHaveProperty('name')
        expect(res.body).toHaveProperty('message')
        expect(res.body).not.toHaveProperty('data')
        expect(res.body).not.toHaveProperty('status')
        expect(res.body.name).toBe('ProcessError')
        expect(res.body.message).toBe(`Character must have a userName.`)
      })

      it('should respond status 200 if character not found.', async () => {
        const newUser = 'ChangeDaUser'
        const changedChar = { ...updateCharacter }
        changedChar.userName = newUser
        changedChar._id = new ObjectID()
        const res = await request(server).put(`/api/characters/`)
          .set('authorization', 'Bearer ' + token)
          .send({ ...changedChar })
        expect(res.status).toEqual(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveProperty('modifiedCount')
        expect(res.body.message).toBe(`Failed to update character.`)
        expect(res.body.status).toBe('Processed')
        expect(res.body.data.modifiedCount).toBe(0)
        expect(res.body.errors.length).toBeGreaterThan(0)
      })

      it('should respond status 200 and return character if found.', async () => {
        const newUser = 'ChangeDaUser'
        const changedChar = { ...updateCharacter }
        changedChar.userName = newUser
        const res = await request(server).put(`/api/characters/`)
          .set('authorization', 'Bearer ' + token)
          .send({ ...changedChar })
        expect(res.status).toEqual(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveProperty('modifiedCount')
        expect(res.body.message).toBe('Update character success.')
        expect(res.body.status).toBe('Processed')
        expect(res.body.data.modifiedCount).toBe(1)
      })
    })
  })

  describe('Delete Character', () => {
    beforeAll(async () => {
      updateCharacter = CreateCharacterMock()
      const result = await request(server).post(`/api/characters`)
        .set('authorization', 'Bearer ' + token)
        .send({ data: newCharacter })
      updateCharacter._id = result?.body?.data?._id
    })

    describe('Delete Character /api/characters/:_id, ', () => {
      it('should respond status 200 when character not found', async () => {
        const _id = 'notvalide!!@@!@!@!@!@!@!@!@'
        const res = await request(server).delete(`/api/characters/${_id}`)
          .set('authorization', 'Bearer ' + token)
        expect(res.status).toEqual(422)
        expect(res.body).toHaveProperty('message')
        expect(res.body).not.toHaveProperty('data')
        expect(res.body.message).toBe(`Invalid character _id format: notvalide!!@@!@!@!@!@!@!@!@`)
      })

      it('should respond status 200 if character not found.', async () => {
        const _id = new ObjectID()
        const res = await request(server).delete(`/api/characters/${_id}`)
          .set('authorization', 'Bearer ' + token)
        expect(res.status).toEqual(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveProperty('deletedCount')
        expect(res.body.message).toBe(`Failed to delete character: ${_id}`)
        expect(res.body.status).toBe('Processed')
        expect(res.body.data.deletedCount).toBe(0)
      })

      it('should respond status 200 if character found.', async () => {
        const _id = updateCharacter._id
        const res = await request(server).delete(`/api/characters/${_id}`)
          .set('authorization', 'Bearer ' + token)
        expect(res.status).toEqual(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toHaveProperty('deletedCount')
        expect(res.body.message).toBe(`Delete character success: ${_id}`)
        expect(res.body.status).toBe('Processed')
        expect(res.body.data.deletedCount).toBe(1)
      })
    })
  })
})