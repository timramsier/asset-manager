const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const logger = require('morgan')
const passport = require('passport')
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

app.use(logger('dev'))

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}))

// Use the passport package in our application
app.use(passport.initialize())

app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,X-Access-Token,X-Key,Authorization')
  if (req.method === 'OPTIONS') {
    res.status(200).end()
  } else {
    next()
  }
})

var landing = (`<h1>Mock API</h1>`)

app.get('/', (req, res) => {
  res.send(landing)
})

app.use('/api/alpha/', api)

// If no route is matched by now, it must be a 404
app.use(function (req, res, next) {
  var err = new Error('API Not Found')
  err.status = 404
  next(err)
})

// Start the server
app.set('port', process.env.PORT || 3000)

var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + server.address().port)
})
