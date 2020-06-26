const express          = require('express')
const { createServer } = require('http')

// create the express app
const app = express()

// create the http server
const server = createServer(app)

// serve up the public folder
app.use(express.static('public'))

// listen in on our fav port
server.listen(4243)