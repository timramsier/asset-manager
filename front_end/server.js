require('babel-register')({
  'plugins': [
    [
      'babel-plugin-transform-require-ignore',
      {
        extensions: ['.less']
      }
    ]
  ]
})

const express = require('express')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const ReactRouter = require('react-router-dom')
const StaticRouter = ReactRouter.StaticRouter
const _ = require('lodash')
const fs = require('fs')

const PORT = process.env.PORT || 80
const baseTemplate = fs.readFileSync('./index.html')
const template = _.template(baseTemplate)
const App = require('./js/App').default

const server = express()

server.use('/public', express.static('./public'))

server.use((req, res) => {
  const context = {}
  const body = ReactDOMServer.renderToString(
    React.createElement(StaticRouter, {location: req.url, context},
      React.createElement(App)
    )
  )
  if (context.url) {
    res.redirect(context.url)
  }

  res.write(template({body}))
  res.end()
})

console.log('listening on port', PORT)
server.listen(PORT)
