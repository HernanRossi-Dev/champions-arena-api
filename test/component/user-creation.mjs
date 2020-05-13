'use strict';
process.env.NODE_ENV = 'test';

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app.js';
import faker from 'faker';

const mongoDBUrl =
  "mongodb+srv://HernanRossi:UMlYnuMQWVomlFYW@pathfinderarena-gmjjh.mongodb.net/test";
const ObjectId = mongoose.Types.ObjectId;
chai.should();
chai.use(chaiHttp);

let testApp, userName, userEmail, _id;

describe('Users', () => {

    beforeEach( async () => {
        testApp = chai.request(app);
        return mongoose.createConnection(mongoDBUrl, { useNewUrlParser: true });
    })

    afterEach(()=>{
        testApp.close();
    })

    describe('Get Users: ', () => {
        it('Get users should response status 200 and return array', async () => {
            const response = await testApp.get('/api/users');
            const jsonRes = JSON.parse(response.res.text);
            response.status.should.equal(200);
            jsonRes.users.should.be.a('array');
        })
    })
    describe('Get User: ', () => {
        before (async () => {
            userName = faker.name.firstName();
            userEmail = faker.internet.email();
            const userPayload =  { 
                name: userName,
                email: userEmail,
                password: uuidv4(),
                isGuest: false,
            }
            testApp = chai.request(app);
            await mongoose.createConnection(mongoDBUrl, { useNewUrlParser: true });
            const postResult = await testApp.post(`/api/user/basic`).send(userPayload);           
            _id = JSON.parse(postResult.res.text);
            testApp.close();
        })
        it('by email should response status 200 and return object', async () => {
            const response = await testApp.get(`/api/user?email=${userEmail}`);
            const jsonRes = JSON.parse(response.res.text);
            response.status.should.equal(200);
            jsonRes.user.should.be.a('object');
        })

        it('by name should response status 200 and return object', async () => {
            const response = await testApp.get(`/api/user?name=${userName}`);
            const jsonRes = JSON.parse(response.res.text);
            response.status.should.equal(200);
            jsonRes.user.should.be.a('object');
        })

        it('by _id should response status 200 and return object', async () => {
            const response = await testApp.get(`/api/user?_id=${_id}`);
            const jsonRes = JSON.parse(response.res.text);
            response.status.should.equal(200);
            jsonRes.user.should.be.a('object');
        })
    })
})