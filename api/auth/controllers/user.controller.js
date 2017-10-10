// Load required packages
var User = require('../schema');
var _controller = require('../../routes/controllers/_.controller');

// Create endpoint /api/users for POST
var addUser = _controller(User).add

var updateUser = _controller(User).update

// Create endpoint /api/users for GET
var getUsers = _controller(User).getAll;

const getUserByShortId = (req, res, next) => {
  _controller(User, {}, { _shortId: req.params.shortId }).getOne(
    req,
    res,
    next
  );
};

// Get meta information
var getUserMeta = _controller(User).getMeta;

// Validate password
var login = (req, res, next) => {
  var { _id, password } = req.body;
  return _controller(User, {}, { _id }).getOne(req, res, next, (err, user) => {
    if (err) return res.send(err).status(500);
    user.verifyPassword(password, function(err, isMatch) {
      if (err) {
        return res.send(err).status(500);
      }
      // Password did not match
      if (!isMatch) {
        return res.sendStatus(401);
      }

      // Success
      return res.send(user).status(200);
    });
  });
};

module.exports = {
  addUser,
  getUsers,
  getUserByShortId,
  updateUser,
  getUserMeta,
  login,
};
