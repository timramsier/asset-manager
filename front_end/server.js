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
const ReactRouter = require('react-router')
const ServerRouter = ReactRouter.ServerRouter
const apiSettings = require('./config/apiSettings')
const _ = require('lodash')
const fs = require('fs')

const PORT = process.env.PORT || 80
const baseTemplate = fs.readFileSync('./index.html')
const template = _.template(baseTemplate)
const App = require('./js/App').default

const server = express()

server.use('/public', express.static('./public'))

server.use((req, res) => {
  const context = ReactRouter.createServerRenderContext()
  const body = ReactDOMServer.renderToString(
    React.createElement(ServerRouter, {location: req.url, context: context},
      React.createElement(App)
    )
  )
  res.write(template({body: body}))
  res.end()
})

console.log('\x1b[33mUsing API uri:', apiSettings.uri, '\x1b[0m')
console.log('\x1b[33mUsing API key:', apiSettings.auth.username, '\x1b[0m')

console.log('listening on port', PORT)
server.listen(PORT)
