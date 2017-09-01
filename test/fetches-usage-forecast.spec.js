const request = require('supertest')
const server = require('../app/server')
const { expect } = require('chai')

let app

describe('fetching usage forecast', () => {
  beforeEach((done) => {
    app = server.listen(1234, done)
  })
  afterEach(() => {
    app.close()
  })

  it('was succesful', (done) => {
    const street = '30 Reading Ave'
    const city = 'Yardley'
    const state = 'PA'
    const zip = '19067'

    const expectedResponse = {
      zid: '12312312',
      forecasted_usage: '1200',
    }

    request(app)
      .get('/api/forecast')
      .query({ street, city, state, zip })
      .expect(200, done)
      .expect((res) => {
        expect(res.body).to.deep.equal(expectedResponse)
      })
      .expect('content-type', /json/)
  })
})
