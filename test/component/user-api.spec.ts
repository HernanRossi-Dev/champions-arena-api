process.env.NODE_ENV = 'test'

// import * as mongoose from 'mongoose'
// import * as uuid from 'uuid'
// import * as faker from 'faker'
import request from "supertest";
import app from '../../src/app'

// const { v4: uuidv4 } = uuid
// const ObjectId = mongoose.Types.ObjectId

// let userName, userEmail, _id
describe('Users-API', () => {

    describe('Get Users: ', () => {
       
        it('should respond status 200: /api/users', async () => {
            const res = await request(app).get('/api/users')
             
            // expect(res.status).toEqual(200);
            console.log(res.body);
            // expect(res.body).toHaveProperty('post')
          })

        // it('Get users should response status 200 and return array', async () => {
        //     const response = await testApp.get('/api/users');
        //     const jsonRes = JSON.parse(response.res.text);
        //     response.status.should.equal(200);
        //     jsonRes.users.should.be.a('array');
        // })}
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