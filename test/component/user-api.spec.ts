import mongoose from 'mongoose'
import uuid from 'uuid'
import faker from 'faker'
import request from "supertest"
import server from '../../src/server'
import { ObjectID } from 'mongodb'


const ObjectId = mongoose.Types.ObjectId

// let userName, userEmail, _id
describe('Users-API', () => {

  afterEach(() => {
    server.close()
  })
  describe('Get Users: ', () => {

    it('should respond status 200: /api/users', async () => {
      const id = new ObjectID()
      const res = await request(server).get(`/api/users/${id}`)
      expect(res.status).toEqual(200);
      const jsonRes = JSON.parse(res.text);
      expect(jsonRes.body).toEqual({});
      expect(jsonRes.errors.length).toBeGreaterThan(0)
    })
  });

  // describe('Get User: ', () => {
  //     before (async () => {
  //         userName = faker.name.firstName();
  //         userEmail = faker.internet.email();
  //         const userPayload =  { 
  //             name: userName,
  //             email: userEmail,
  //             password: uuidv4(),
  //             isGuest: false,
  //         }
  //         testApp = chai.request(app);
  //         await mongoose.createConnection(mongoDBUrl, { useNewUrlParser: true });
  //         const postResult = await testApp.post(`/api/user/basic`).send(userPayload);           
  //         _id = JSON.parse(postResult.res.text);
  //         testApp.close();
  //     })
  //     it('by email should response status 200 and return object', async () => {
  //         const response = await testApp.get(`/api/user?email=${userEmail}`);
  //         const jsonRes = JSON.parse(response.res.text);
  //         response.status.should.equal(200);
  //         jsonRes.user.should.be.a('object');
  //     })

  //     it('by name should response status 200 and return object', async () => {
  //         const response = await testApp.get(`/api/user?name=${userName}`);
  //         const jsonRes = JSON.parse(response.res.text);
  //         response.status.should.equal(200);
  //         jsonRes.user.should.be.a('object');
  //     })

  //     it('by _id should response status 200 and return object', async () => {
  //         const response = await testApp.get(`/api/user?_id=${_id}`);
  //         const jsonRes = JSON.parse(response.res.text);
  //         response.status.should.equal(200);
  //         jsonRes.user.should.be.a('object');
  //     })
  // })
})