// Load required packages
var User = require('../schema')

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
exports.getUsers = function (req, res) {
  User.find(function (err, users) {
    if (err) return res.send(err)

    res.json(users)
  })
}
