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
let db;

describe('Character', () => {

    beforeEach( async () => {
        app = chai.request(server);
        return mongoose.createConnection(mongoDBUrl, { useNewUrlParser: true });
        
    })

    afterEach(()=>{
        app.close();
    })

    describe('Get Characters: ', () => {
        it('Get characters should response status 200 and return array', async () => {
            const response = await app.get('/api/characters');
            const jsonRes = JSON.parse(response.res.text);
            response.status.should.equal(200);
            jsonRes.characters.should.be.a('array');
        })
    })

    describe('Get Character:', () => {
        it('Get character/id should responsd status 422 with invalid id format', async () => {
            const charId = uuid.v4();
            const response = await app.get(`/api/characters/${charId}`);
            response.status.should.equal(422);
        })
        it('Get character/id should response status 404 when character not found', async () => {
            const charId = new ObjectID();
            const response = await app.get(`/api/characters/${charId}`);
            response.status.should.equal(404);
        })
    })

    describe('Create Character:', () => {
        it('Create Character without a name returns status 422.', async () => {
            const newCharacterNoName = mockCharacter.createCharacterMock();
            newCharacterNoName.name = '';
            const response = await app.post(`/api/characters`).send(newCharacterNoName);
            const jsonRes = JSON.parse(response.res.text);
            jsonRes.message.should.equal('New Character must have a name.');
            response.status.should.equal(422);
        })
    
        it('Create Character with valid payload should succeed status 200 and return created character.', async () => {
            const newCharacter = mockCharacter.createCharacterMock();
            const response = await app.post(`/api/characters`).send(newCharacter);
            const jsonRes = JSON.parse(response.res.text);
            const newID = jsonRes._id;
            jsonRes.should.be.a('object');
            newID.should.be.a('string');
            response.status.should.equal(200);
        })
    })
    
    describe('Update Character:', () => {
        it('Update Character with valid id and payload should succeed status 200.', async () => {
            const newCharacter = mockCharacter.createCharacterMock();
            newCharacter.name = faker.name.firstName();
            newCharacter.alignment = 'Neutral';
            newCharacter.level = 1;
            newCharacter.XP = 100;
            const response = await app.post(`/api/characters`).send(newCharacter);
            const jsonRes = JSON.parse(response.res.text);
            response.status.should.equal(200);
            app = chai.request(server);
            await mongoose.createConnection(mongoDBUrl, { useNewUrlParser: true });
            const newName = faker.name.firstName();
            jsonRes.name = newName;
            const newID = jsonRes._id;
            jsonRes.level = 2;
            jsonRes.XP = 500;
            const updateResponse = await app.put(`/api/characters/${newID}`).send(jsonRes);
            const updateJson =  JSON.parse(updateResponse.res.text);
            updateResponse.status.should.equal(200);
            updateJson.name.should.equal(newName);
            updateJson.level.should.equal(2);
            updateJson.XP.should.equal(500);            
        })
    
        it('Update Character with invalid id and payload should fail status 422.', async () => {
            const newCharacter = mockCharacter.createCharacterMock();
            newCharacter.name = faker.name.firstName();
            newCharacter.alignment = 'Neutral';
            newCharacter.level = 1;
            newCharacter.XP = 100;
            const response = await app.post(`/api/characters`).send(newCharacter);
            const jsonRes = JSON.parse(response.res.text);
            response.status.should.equal(200);
            app = chai.request(server);
            await mongoose.createConnection(mongoDBUrl, { useNewUrlParser: true });
            const newName = faker.name.firstName();
            jsonRes.name = newName;
            const newID = uuid.v4();
            jsonRes.level = 2;
            jsonRes.XP = 500;
            const updateResponse = await app.put(`/api/characters/${newID}`).send(jsonRes);
            updateResponse.status.should.equal(422);           
        })
    })
    
    describe('Delete Character:', () => {
        it('Delete Character with valid id and payload should succeed status 200.', async () => {
            const newCharacter = mockCharacter.createCharacterMock();
            const response = await app.post(`/api/characters`).send(newCharacter);
            const jsonRes = JSON.parse(response.res.text);
            response.status.should.equal(200);
            app = chai.request(server);
            await mongoose.createConnection(mongoDBUrl, { useNewUrlParser: true });
            const newID = jsonRes._id;
            const deleteResponse = await app.delete(`/api/characters/${newID}`);
            deleteResponse.status.should.equal(200);
            deleteResponse.body.status.should.equal('OK');
            deleteResponse.body.result.n.should.equal(1);
        })
    
        it('Delete Character with invalid id should response status 422.', async () => {
            const newID = uuid.v4();;
            const deleteResponse = await app.delete(`/api/characters/${newID}`);
            deleteResponse.status.should.equal(422);
        })
    })
})