const Zillow = require('node-zillow')

const zwsid = process.env.ZWSID
const zillow = new Zillow(zwsid)

const fetchPropertyId = (address, city, state, zip) => zillow.get('GetSearchResults', {
  address,
  citystatezip: `${city}, ${state} ${zip}`,
})
  .then(r => r.response.results.result[0].zpid[0])

const fetchPropertyDetails = (address, city, state, zip) =>
  fetchPropertyId(address, city, state, zip)
    .then(propertyId => zillow.get('GetUpdatedPropertyDetails', {
      zpid: propertyId,
    })
    .then(r => ({
      zid: r.response.zpid,
      squareFeet: parseInt(r.response.editedFacts.finishedSqFt[0], 10),
      numRooms: parseInt(r.response.editedFacts.numRooms[0], 10),
    })),
)

// eslint-disable-next-line no-mixed-operators
const calculateUsage = (squareFeet, numRooms) => squareFeet * 0.5 + numRooms * 10

module.exports = {
  fetchPropertyDetails,
  calculateUsage,
}
