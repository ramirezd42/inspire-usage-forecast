const express = require('express')
const validator = require('express-validator')
const validates = require('./middleware/validates')

const { calculateUsage } = require('./forecast.model')
const fetchPropertyDetails = require('./middleware/fetchPropertyDetails')

const server = express()
server.use(validator())

const validateForecast = (req) => {
  req.checkQuery('address', 'missing address').notEmpty()
  req.checkQuery('city', 'missing address').notEmpty()
  req.checkQuery('state', 'missing address').notEmpty()
  req.checkQuery('zip', 'missing address').notEmpty()
}

server.use('/api/forecast',
  validates([validateForecast]),
  fetchPropertyDetails,
  (req, res) => res.json({
    forecasted_usage: calculateUsage(req.propertyDetails.squareFeet, req.propertyDetails.numRooms),
    zid: req.propertyDetails.zid,
  }),
)

module.exports = server
