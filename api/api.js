const express = require('express')
const app = express()
var generateData = require('./js/generateData')
var data = {}

data.assets = require('./data/assets')
data.siteConfig = require('./data/siteConfig')

data.assets[0].models = data.assets[0].models.concat(generateData.assets(30))
data.assets[1].models = data.assets[1].models.concat(generateData.assets(30))
data.assets[2].models = data.assets[2].models.concat(generateData.assets(30))
data.assets[3].models = data.assets[3].models.concat(generateData.assets(30))

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

app.get('/api/mock/:dataTarget', (req, res) => {
  res.send(JSON.stringify(data[req.params.dataTarget]))
})
app.get('/api/mock/:dataTarget/:productType', (req, res) => {
  const filteredData = data[req.params.dataTarget].filter((data) => {
    return (data.name === req.params.productType)
  })
  if (req.query.active) {
    var active
    if (req.query.active === 'true') {
      active = true
    } else {
      active = false
    }
    if (filteredData) {
      res.send(JSON.stringify([
        {
          name: filteredData[0].name,
          description: filteredData[0].description,
          categoryId: filteredData[0].categoryId,
          models: filteredData[0].models.filter((item) => {
            return item.active === active
          })
        }
      ]))
    } else {
      res.send('[{}]')
    }
  } else {
    if (filteredData) {
      res.send(JSON.stringify(filteredData))
    } else {
      res.send('[{}]')
    }
  }
})

app.listen(3000, () => {
  console.log('Test API Server running')
})
