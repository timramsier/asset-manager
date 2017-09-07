// Load required packages
var User = require('../schema')
const _controller = require('../../routes/controllers/_.controller')

// Create endpoint /api/users for POST
exports.postUsers = function (req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    accessLevel: req.body.accessLevel
  })

  user.save(function (err) {
    if (err) return res.send(err)

    res.json({ message: 'New User Added' })
  })
}

// Create endpoint /api/users for GET
exports.getUsers = _controller(User).getAll

// Validate password
exports.login = (req, res, next) => {
  console.log(req.body)
  const { _id, password } = req.body
  _controller(User, {}, { _id })
  .getOne(req, res, next, (err, user) => {
    if (err) return res.send(err).status(500)
    user.verifyPassword(password, function (err, isMatch) {
      if (err) { return res.send(err).status(500) }

      // Password did not match
      if (!isMatch) { return res.sendStatus(401) }

      // Success
      return res.send(user).status(200)
    })
  })
}
