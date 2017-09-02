const { fetchPropertyDetails, errorTypes } = require('../forecast.model')

module.exports = (req, res, next) => {
  const { address, city, state, zip } = req.query
  return fetchPropertyDetails(address, city, state, zip)
    .then((details) => {
      req.propertyDetails = details
      next()
    })
    .catch((err) => {
      if (err.type === errorTypes.NOT_FOUND) {
        res.status(404).send(`Property Details Not Found: ${err.message}`)
      }
      res.status(500).send(`Error Fetching Property Details: ${err.message}`)
    })
}
