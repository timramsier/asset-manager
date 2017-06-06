const express = require('express')
const mongoose = require('mongoose')
const api = require('./routes/api.router')

// database config
const database = {
  defaults: {
    name: 'test_assets',
    host: 'localhost'
  }
}
mongoose.connect(`mongodb://${database.defaults.host}/${database.defaults.name}`)
var dbConnection = mongoose.connection
dbConnection.on('error', console.error.bind(console, 'MongoDB connection error:'))
// require('./js/seed')

const app = express()
// var data = {}
var port = 3000

// Allow CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

var landing = (`
      <h1>Mock API</h1>
      <p>
        This is a mock API for testing.  Please use one of the following API calls:
      </p>

      <ul>
        <li>/api/mock/cardTypes</li>
        <li>/api/mock/assets</li>
        <li>/api/mock/siteConfig</li>
      </ul>
    `)

app.get('/', (req, res) => {
  res.send(landing)
})

app.use('/api/alpha/', api)

app.listen(port, () => {
  console.log(`Test API Server running running on ${port}`)
})
