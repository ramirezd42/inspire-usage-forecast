const request = require('supertest')
const server = require('../app/server')

let app

describe('server', () => {
  beforeEach((done) => {
    app = server.listen(1234, done)
  })
  afterEach(() => {
    app.close()
  })

  it('is running', (done) => {
    request(app)
    .get('/api')
    .expect('content-type', /json/)
    .expect(200, done)
  })
})
