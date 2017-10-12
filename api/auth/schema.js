const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const shortId = require('shortid');

const userSchema = Schema({
  _shortId: {
    type: String,
    unique: true,
    default: shortId.generate,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  firstName: String,
  lastName: String,
  password: {
    type: String,
    required: true,
  },
  accessLevel: {
    type: String,
    required: true,
  },
  lastModifiedBy: {
    type: String,
    ref: 'User',
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

function hashPassword(callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified || !user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
}

// Execute before each save, create, and update call
userSchema.pre('save', hashPassword);
userSchema.pre('create', hashPassword);

userSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.index({
  accessLevel: 'text',
  email: 'text',
  firstName: 'text',
  lastName: 'text',
  username: 'text',
});

module.exports = mongoose.model('User', userSchema);
