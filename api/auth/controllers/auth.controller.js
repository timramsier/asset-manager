// Load required packages
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const User = require('../schema');

passport.use(
  new BasicStrategy((username, password, callback) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return callback(err);
      }

      // No user found with that username
      if (!user) {
        return callback(null, false);
      }

      // if password sent is salted SUCCESS
      if (password === user.password) {
        return callback(null, user);
      }

      // Make sure the password is correct
      user.verifyPassword(password, (err, isMatch) => {
        if (err) {
          return callback(err);
        }

        // Password did not match
        if (!isMatch) {
          return callback(null, false);
        }

        // Success
        return callback(null, user);
      });
    });
  })
);

exports.isAuthenticated = passport.authenticate('basic', { session: false });
