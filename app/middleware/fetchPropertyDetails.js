const { fetchPropertyDetails } = require('../forecast.model')

module.exports = (req, res, next) => {
  const { address, city, state, zip } = req.query
  return fetchPropertyDetails(address, city, state, zip)
    .then((details) => {
      req.propertyDetails = details
      next()
    })
    .catch(err => next(err))
}
