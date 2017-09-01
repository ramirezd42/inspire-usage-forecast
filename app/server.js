const express = require('express')
const { fetchPropertyDetails, calculateUsage } = require('./forecast.model')

const server = express()

server.use('/api/forecast', (req, res) => {
  const { address, city, state, zip } = req.query
  return fetchPropertyDetails(address, city, state, zip)
    .then(details => res.json({
      forecasted_usage: calculateUsage(details.squareFeet, details.numRooms),
      zid: details.zid,
    }))
})

module.exports = server
