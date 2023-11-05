const express = require('express')
const path = require('path')
require('dotenv').config()

const app = express()
const server = require('http').Server(app)
const cors = require('cors')


process.env.NX_SERVER_URL = 'http://localhost:NX_SERVER_URL/api'

const corsOption = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}

app.use(cors(corsOption))

app.use(express.static(path.join(__dirname, '../dist/esign-web')))
app.get(/^(?!\/api\/)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/esign-web/index.html'))
})

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(res.status(404).send({ error: 'Not found' }))
})

const port = process.env.ESIGN_PORT || 4008

server.listen(port, () => {
  console.log('App is listening on port ', port)
})
