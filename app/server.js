const express = require('express')

const server = express()
server.use('/api', (req, res) => res.json({ message: 'hello' }))

module.exports = server
