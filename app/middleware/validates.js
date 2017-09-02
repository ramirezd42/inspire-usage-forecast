const util = require('util')

module.exports = validators => (req, res, next) => {
  validators.forEach((validator) => {
    validator(req)
  })
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      const errorString = util.inspect(result.array())
      res.status(400).send(`Request validation error: ${errorString}`)
      next(errorString)
    }
    next()
  })
}
