const express = require('express')
const Zillow = require('node-zillow')

const zwsid = process.env.ZWSID
const zillow = new Zillow(zwsid)

const server = express()

const fetchPropertyId = (address, city, state, zip) => zillow.get('GetSearchResults', {
  address,
  citystatezip: `${city}, ${state} ${zip}`,
})
  .then(r => r.response.results.result[0].zpid[0])

const fetchPropertyDetails = propertyId => zillow.get('GetUpdatedPropertyDetails', {
  zpid: propertyId,
})
  .then(r => ({
    zid: r.response.zpid,
    squareFeet: parseInt(r.response.editedFacts.finishedSqFt[0], 10),
    numRooms: parseInt(r.response.editedFacts.numRooms[0], 10),
  }))

server.use('/api/forecast', (req, res) => {
  const { address, city, state, zip } = req.query
  return fetchPropertyId(address, city, state, zip)
    .then(fetchPropertyDetails)
    .then(details => res.json({
      forecasted_usage: details.squareFeet * 0.5 + details.numRooms * 10,
      zid: details.zid,
    }))
})

module.exports = server
