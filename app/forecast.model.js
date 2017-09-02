const Zillow = require('node-zillow')

const zwsid = process.env.ZWSID
const zillow = new Zillow(zwsid)

const errorTypes = {
  NOT_FOUND: 'NOT_FOUND',
  DEFAULT: 'DEFAULT',
}

const getErrorTypeForCode = (code, codesByType) =>
  Object.keys(codesByType).reduce((prev, cur) => (codesByType[cur].includes(code) ? cur : prev)
, errorTypes.DEFAULT)

const prepareError = (message, responseCodes) => {
  const type = getErrorTypeForCode(message.code, responseCodes)
  return { type, message: message.text }
}

const fetchPropertyId = (address, city, state, zip) => zillow.get('GetSearchResults', {
  address,
  citystatezip: `${city}, ${state} ${zip}`,
})
  .then((r) => {
    const responseCodes = {
      [errorTypes.NOT_FOUND]: ['507', '508', '502', '504'],
    }
    return r.message.code === '0'
      ? r.response.results.result[0].zpid[0]
      : Promise.reject(prepareError(r.message, responseCodes))
  })

const fetchPropertyDetails = (address, city, state, zip) =>
  fetchPropertyId(address, city, state, zip)
    .then(propertyId => zillow.get('GetUpdatedPropertyDetails', {
      zpid: propertyId,
    })
    .then((r) => {
      const responseCodes = {
        [errorTypes.NOT_FOUND]: ['502', '501'],
      }
      return r.message.code === '0'
        ? ({
          zid: r.response.zpid,
          squareFeet: parseInt(r.response.editedFacts.finishedSqFt[0], 10),
          numRooms: parseInt(r.response.editedFacts.numRooms[0], 10),
        })
        : Promise.reject(prepareError(r.message, responseCodes))
    }),
)

// eslint-disable-next-line no-mixed-operators
const calculateUsage = (squareFeet, numRooms) => squareFeet * 0.5 + numRooms * 10

module.exports = {
  fetchPropertyDetails,
  calculateUsage,
  errorTypes,
}
