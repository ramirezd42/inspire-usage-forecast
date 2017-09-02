const express = require('express')
const validator = require('express-validator')
const validates = require('./middleware/validates')

const { fetchPropertyDetails, calculateUsage } = require('./forecast.model')

const server = express()
server.use(validator())

const validateForecast = (req) => {
  req.checkQuery('address', 'missing address').notEmpty()
  req.checkQuery('city', 'missing address').notEmpty()
  req.checkQuery('state', 'missing address').notEmpty()
  req.checkQuery('zip', 'missing address').notEmpty()
}

server.use('/api/forecast', validates([validateForecast]), (req, res) => {
  const { address, city, state, zip } = req.query
  return fetchPropertyDetails(address, city, state, zip)
    .then(details => res.json({
      forecasted_usage: calculateUsage(details.squareFeet, details.numRooms),
      zid: details.zid,
    }))
})

module.exports = server
