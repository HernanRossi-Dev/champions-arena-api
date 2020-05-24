import server from '../../src/server'
jest.mock('../../src/utils/mongo-connection', () => ({
  getMongoConnection: jest.fn().mockImplementation(() =>  console.log("mock db"))
}))

describe('server', () => {
  it('Should export server.', () => {
    expect(server).toBeDefined()
    server.close()
  })
})