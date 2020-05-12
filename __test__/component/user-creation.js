process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const mockCharacter = require('../_mocks/create-character-mock');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../static/server/server');
const faker = require('faker');

const mongoDBUrl =
  "mongodb+srv://HernanRossi:UMlYnuMQWVomlFYW@pathfinderarena-gmjjh.mongodb.net/test";
const uuid = require('uuid');
const { ObjectID } = require("mongodb");
chai.should();
chai.use(chaiHttp);

let app;
let userName;
let userEmail;
let _id;

describe('Users', () => {

    beforeEach( async () => {
        app = chai.request(server);
        return mongoose.createConnection(mongoDBUrl, { useNewUrlParser: true });
    })

    afterEach(()=>{
        app.close();
    })

    describe('Get Users: ', () => {
        it('Get users should response status 200 and return array', async () => {
            const response = await app.get('/api/users');
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
                password: uuid.v4(),
                isGuest: false,
            }
            app = chai.request(server);
            await mongoose.createConnection(mongoDBUrl, { useNewUrlParser: true });
            const postResult = await app.post(`/api/user/basic`).send(userPayload);           
            _id = JSON.parse(postResult.res.text);
            app.close();
        })
        it('by email should response status 200 and return object', async () => {
            const response = await app.get(`/api/user?email=${userEmail}`);
            const jsonRes = JSON.parse(response.res.text);
            response.status.should.equal(200);
            jsonRes.user.should.be.a('object');
        })

        it('by name should response status 200 and return object', async () => {
            const response = await app.get(`/api/user?name=${userName}`);
            const jsonRes = JSON.parse(response.res.text);
            response.status.should.equal(200);
            jsonRes.user.should.be.a('object');
        })

        it('by _id should response status 200 and return object', async () => {
            const response = await app.get(`/api/user?_id=${_id}`);
            const jsonRes = JSON.parse(response.res.text);
            response.status.should.equal(200);
            jsonRes.user.should.be.a('object');
        })
    })
})