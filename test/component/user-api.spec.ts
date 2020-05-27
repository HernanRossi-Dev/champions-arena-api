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
import { IUser } from '../../src/models'

let testUser: IUser, token: string

const getNewUser = (isGuest = false) => {
  return {
    userName: faker.name.firstName(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.lorem.sentence(),
    isGuest,
  }
}

describe('Users-API', () => {

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

  describe('Get User endpoints', () => {
    beforeAll(async () => {
      const newUser = getNewUser()
      const result = await request(server).post(`/api/users`)
        .set('authorization', 'Bearer ' + token)
        .send(newUser)
      testUser = result.body?.data
    })

    describe('Get User by id /api/users/:_id, ', () => {
      it('should respond status 422 when invalid _id provided', async () => {
        const _id = 'notvalide!!@@!@!@!@!@!@!@!@'
        const res = await request(server).get(`/api/users/${_id}`)
        console.log('Get resp one',res.body)
        expect(res.status).toEqual(422)
        expect(res.body).toHaveProperty('message')
        expect(res.body).not.toHaveProperty('data')
        expect(res.body.message).toBe(`Invalid user _id format.`)
      })

      it('should respond status 200 when user not found', async () => {
        const _id = new ObjectID()
        const res = await request(server).get(`/api/users/${_id}`)
        expect(res.status).toEqual(200)
        expect(res.body.status).toEqual('Processed')
        expect(res.body.data).toEqual({})
        expect(res.body.message).toEqual(`Get user failed: ${_id}`)
        expect(res.body.errors.length).toBeGreaterThan(0)
      })

      it('should respond status 200 and return user if found.', async () => {
        const _id = testUser._id
        const res = await request(server).get(`/api/users/${_id}`)
        expect(res.status).toEqual(200)
        expect(res.body.status).toEqual('Processed')
        const user = res.body.data
        expect(user).toHaveProperty('_id')
        expect(user).toHaveProperty('userName')
        expect(res.body.message).toEqual(`Get user success: ${_id}`)
        expect(res.body.errors.length).toBe(0)
      })
    })

    describe('Get User by query /api/users/ ', () => {
      it('should respond status 200 if you user not found', async () => {
        const fakename = faker.name.firstName()
        const res = await request(server).get(`/api/users/`)
          .set('authorization', 'Bearer ' + token)
          .query({ userName: fakename })
        expect(res.status).toEqual(200)
        expect(res.body.status).toEqual('Processed')
        expect(res.body.message).toEqual('Failed to fetch user.')
        expect(res.body.errors.length).toBeGreaterThan(0)
      })

      it('by user should respond status 200 and return object', async () => {
        const id = testUser._id
        const res = await request(server).get(`/api/users/`)
          .set('authorization', 'Bearer ' + token)
          .query({ userName: testUser.userName })
        expect(res.status).toEqual(200)
        expect(res.body.status).toEqual('Processed')
        const user = res.body.data
        expect(user).toHaveProperty('_id')
        expect(user._id).toEqual(id)
        expect(user).toHaveProperty('userName')
        expect(res.body.message).toEqual('Get user success.')
        expect(res.body.errors.length).toBe(0)
      })
    })
  })

  describe('Post User /api/users/ ', () => {
    it.only('should respond status 200 and error when no data sent', async () => {
      const res = await request(server).post(`/api/users`)
        .set('authorization', 'Bearer ' + token)
        .send({})
        console.log('res: ', res.body)
      expect(res.status).toEqual(200)
      expect(res.body).toHaveProperty('name')
      expect(res.body).toHaveProperty('message')
      expect(res.body).not.toHaveProperty('data')
      expect(res.body).not.toHaveProperty('status')
      expect(res.body.name).toBe('ProcessError')
      expect(res.body.message).toBe(`User data must be provided.`)
    })

    it('should respond status 200 and return object', async () => {
      const res = await request(server).post(`/api/characters`)
        .set('authorization', 'Bearer ' + token)
        .send({ data: { user: 'Test name' } })
      expect(res.status).toEqual(200)
      expect(res.body).toHaveProperty('data')
      expect(res.body.message).toBe('Create character success.')
      expect(res.body.status).toBe('Processed')
    })
    it('should respond status 200 and return object', async () => {
      const user = getNewUser()
      const res = await request(server).post(`/api/characters`)
        .set('authorization', 'Bearer ' + token)
        .send({ data: { ...user } })
      expect(res.status).toEqual(200)
      expect(res.body).toHaveProperty('data')
      expect(res.body.message).toBe('Create character success.')
      expect(res.body.status).toBe('Processed')
    })
  })

  // describe('Update User', () => {
  //   beforeAll(async () => {
  //     updateCharacter = CreateCharacterMock()
  //     const result = await request(server).post(`/api/characters`)
  //       .set('authorization', 'Bearer ' + token)
  //       .send({ data: newCharacter })
  //     updateCharacter._id = result?.body?.data?._id
  //   })

  //   describe('Update Character put /api/characters/:id, ', () => {
  //     it('should respond status 422 when bad id provided', async () => {
  //       const id = 'notvalide!!@@!@!@!@!@!@!@!@'
  //       const res = await request(server).put(`/api/characters/${id}`)
  //         .set('authorization', 'Bearer ' + token)
  //         .send({})
  //       expect(res.status).toEqual(422)
  //       expect(res.body).toHaveProperty('message')
  //       expect(res.body).not.toHaveProperty('data')
  //       expect(res.body.message).toBe(`Invalid character id format: notvalide!!@@!@!@!@!@!@!@!@`)
  //     })

  //     it('should respond status 200 when character not found', async () => {
  //       const id = new ObjectID()
  //       const res = await request(server).put(`/api/characters/${id}`)
  //         .set('authorization', 'Bearer ' + token)
  //         .send({})
  //       expect(res.status).toEqual(200)
  //       expect(res.body).toHaveProperty('name')
  //       expect(res.body).toHaveProperty('message')
  //       expect(res.body).not.toHaveProperty('data')
  //       expect(res.body).not.toHaveProperty('status')
  //       expect(res.body.name).toBe('ProcessError')
  //       expect(res.body.message).toBe(`Character data must be provided.`)
  //     })

  //     it('should respond status 200 if character not found.', async () => {
  //       const newUser = 'ChangeDaUser'
  //       const id = new ObjectID()
  //       updateCharacter.user = newUser
  //       const res = await request(server).put(`/api/characters/${id}`)
  //         .set('authorization', 'Bearer ' + token)
  //         .send({ data: { ...updateCharacter } })
  //       expect(res.status).toEqual(200)
  //       expect(res.body).toHaveProperty('data')
  //       expect(res.body.data).toHaveProperty('nModified')
  //       expect(res.body.message).toBe(`Failed to update character: ${id}`)
  //       expect(res.body.status).toBe('Processed')
  //       expect(res.body.data.nModified).toBe(0)
  //       expect(res.body.errors.length).toBeGreaterThan(0)
  //     })

  //     it('should respond status 200 and return character if found.', async () => {
  //       const newUser = 'ChangeDaUser'
  //       const id = updateCharacter._id
  //       updateCharacter.user = newUser
  //       const res = await request(server).put(`/api/characters/${id}`)
  //         .set('authorization', 'Bearer ' + token)
  //         .send({ data: { ...updateCharacter } })
  //       expect(res.status).toEqual(200)
  //       expect(res.body).toHaveProperty('data')
  //       expect(res.body.data).toHaveProperty('nModified')
  //       expect(res.body.message).toBe('Update character success.')
  //       expect(res.body.status).toBe('Processed')
  //       expect(res.body.data.nModified).toBe(1)
  //     })
  //   })
  // })

  // describe('Delete User', () => {
  //   beforeAll(async () => {
  //     updateCharacter = CreateCharacterMock()
  //     const result = await request(server).post(`/api/characters`)
  //       .set('authorization', 'Bearer ' + token)
  //       .send({ data: newCharacter })
  //     updateCharacter._id = result?.body?.data?._id
  //   })

  //   describe('Update Character put /api/characters/:id, ', () => {
  //     it('should respond status 200 when character not found', async () => {
  //       const id = 'notvalide!!@@!@!@!@!@!@!@!@'
  //       const res = await request(server).delete(`/api/characters/${id}`)
  //         .set('authorization', 'Bearer ' + token)
  //       expect(res.status).toEqual(422)
  //       expect(res.body).toHaveProperty('message')
  //       expect(res.body).not.toHaveProperty('data')
  //       expect(res.body.message).toBe(`Invalid character id format: notvalide!!@@!@!@!@!@!@!@!@`)
  //     })

  //     it('should respond status 200 if character not found.', async () => {
  //       const id = new ObjectID()
  //       const res = await request(server).delete(`/api/characters/${id}`)
  //         .set('authorization', 'Bearer ' + token)
  //       expect(res.status).toEqual(200)
  //       expect(res.body).toHaveProperty('data')
  //       expect(res.body.data).toHaveProperty('deletedCount')
  //       expect(res.body.message).toBe(`Failed to delete character: ${id}`)
  //       expect(res.body.status).toBe('Processed')
  //       expect(res.body.data.deletedCount).toBe(0)
  //     })

  //     it('should respond status 200 if character found.', async () => {
  //       const id = updateCharacter._id
  //       const res = await request(server).delete(`/api/characters/${id}`)
  //         .set('authorization', 'Bearer ' + token)
  //       expect(res.status).toEqual(200)
  //       expect(res.body).toHaveProperty('data')
  //       expect(res.body.data).toHaveProperty('deletedCount')
  //       expect(res.body.message).toBe(`Delete character success: ${id}`)
  //       expect(res.body.status).toBe('Processed')
  //       expect(res.body.data.deletedCount).toBe(1)
  //     })
  //   })
})