const logger = require('express-bunyan-logger')
const bunyanDebugStream = require('bunyan-debug-stream')

module.exports = logger({
  name: 'Inspire: Usage Forecast',
  streams: [{
    level: 'info',
    type: 'raw',
    stream: bunyanDebugStream({
      forceColor: true,
    }) }],
  serializers: bunyanDebugStream.serializers,
})
