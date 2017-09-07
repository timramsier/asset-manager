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
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const api = require('./src/js/api').default
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const PORT = process.env.PORT || 80
const baseTemplate = fs.readFileSync('./public/index.html')
const template = _.template(baseTemplate)
const App = require('./src/js/App').default

const server = express()

server.use(fileUpload())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({
  extended: false
}))
server.use('/public', express.static('./public'))

// Authentication
api.getUserByUsername('ADMIN').then(result => console.log(result))
// passport.use(new LocalStrategy(
// (username, password, cb) => {
//   api.getUsers()
//   db.users.findByUsername(username, (err, user) => {
//     if (err) { return cb(err) }
//     if (!user) { return cb(null, false) }
//     if (user.password !== password) { return cb(null, false) }
//     return cb(null, user)
//   })
// }))




// Routes
server.delete('/image/delete', (req, res) => {
  console.log(req.body)
  const { target } = req.body
  const file = `./public/uploads/${target}`
  if (!fs.existsSync(file)) return res.status(200).send('File Doesn\'t Exist')
  fs.unlink(file, err => {
    if (err) return res.status(400).send(err)
    res.sendStatus(200)
  })
})

server.put('/image/upload', (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.')
  }
  const fileKeys = Object.keys(req.files)
  fileKeys.forEach(key => {
    const file = req.files[key]
    const dir = './public/uploads'
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    file.mv(`${dir}/${req.body[`fileName-${key}`]}`, (err) => {
      if (err) { return res.status(500).send(err) }
      res.send('File Uploaded!')
    })
  })
})

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
