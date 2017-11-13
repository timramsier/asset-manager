const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const { userSchema } = require('../auth/schema');
const User = mongoose.model('User', userSchema);
mongoose.Promise = global.Promise;

// database config
const database = {
  name: process.env.APP_DATABASE_NAME || 'app_default_database',
  host: process.env.APP_DATABASE_HOST || 'localhost',
  seed: process.env.APP_DATABASE_SEED || false,
  customApiKey: process.env.APP_CUSTOM_API_KEY || 'non-secure-api-key',
};

console.log('\x1b[33mConnecting to MongoDB:', database, '\x1b[0m');

const dbUri = `mongodb://${database.host}/${database.name}`;
mongoose.connect(dbUri);
// mongoose.set('debug', true)

var dbConnection = mongoose.connection;
dbConnection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);
dbConnection.on('connected', () => {
  fs
    .createReadStream('Users101317.csv')
    .pipe(csv())
    .on('data', user => {
      User.findOne({ username: database.customApiKey }).then(api => {
        User.create(
          {
            username: user.SamAccountName,
            firstName: user.GivenName,
            lastName: user.Surname,
            password: 'null',
            email: user.Mail,
            accessLevel: 'Basic',
            lastModifiedBy: api._id,
          },
          (error, key) => {
            if (error) {
              console.log(`\x1b[31m${error}\x1b[0m`);
            } else {
              console.log(
                '\x1b[32mSuccessfully created ',
                key.username,
                '\x1b[0m'
              );
            }
          }
        );
      });
    });
});
