import app from '../../src/app'
jest.mock('../../src/utils/mongo-connection', () => ({
  getMongoConnection: jest.fn().mockImplementation(() =>  console.log("mock db"))
}))

describe('App', () => {
  it('Should export app.', () => {
    expect(app).toBeDefined();
  })
})