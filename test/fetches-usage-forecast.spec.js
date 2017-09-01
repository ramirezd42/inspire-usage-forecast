 require('dotenv').config()

 const request = require('supertest')
 const { expect } = require('chai')

 const server = require('../app/server')

 let app

 describe('fetching usage forecast', () => {
   beforeEach((done) => {
     app = server.listen(1234, done)
   })
   afterEach(() => {
     app.close()
   })

   it('was succesful', (done) => {
     const address = '2833 Miriam Ave'
     const city = 'Roslyn'
     const state = 'PA'
     const zip = '19001'

     const expectedResponse = {
       zid: '9901059',
       forecasted_usage: 1250,
     }

     request(app)
      .get('/api/forecast')
      .query({ address, city, state, zip })
      .expect(200, done)
      .expect((res) => {
        expect(res.body).to.deep.equal(expectedResponse)
      })
      .expect('content-type', /json/)
   })
 })
