// Load required packages
var User = require('../schema')

// Create endpoint /api/users for POST
exports.postUsers = function (req, res) {
  console.log(req.body)
  var user = new User({
    username: req.body.username,
    password: req.body.password
  })

  user.save(function (err) {
    if (err) { res.send(err) }

    res.json({ message: 'New User Added' })
  })
}

// Create endpoint /api/users for GET
exports.getUsers = function (req, res) {
  User.find(function (err, users) {
    if (err) { res.send(err) }

    res.json(users)
  })
}
