const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const api = require('./routes/api.router');
const User = require('./auth/schema');
process.on('unhandledRejection', console.log.bind(console));
// set mongoose's promise library to es6 promise library
mongoose.Promise = global.Promise;

// database config
const database = {
  name: process.env.APP_DATABASE_NAME || 'app_default_database',
  host: process.env.APP_DATABASE_HOST || 'localhost',
  seed: process.env.APP_DATABASE_SEED || false,
  createAdminUser: process.env.APP_CREATE_ADMIN_USER || false,
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
  console.log('\x1b[32mSuccessfully connected:', dbUri, '\x1b[0m');

  const handlePreviousAPIKey = () => {
    return new Promise((resolve, reject) => {
      if (database.customApiKey) {
        User.findOne({ accessLevel: 'Main API' })
          .remove()
          .exec(error => {
            if (error) {
              console.log(`\x1b[31m${error}\x1b[0m`);
              resolve(false);
            } else {
              console.log(
                '\x1b[32mSuccessfully remove stale API key',
                '\x1b[0m'
              );
              resolve(true);
            }
          });
      } else {
        resolve(true);
      }
    });
  };
  const createAppApiKey = () => {
    return new Promise((resolve, reject) => {
      User.findOne({ accessLevel: 'Main API' }).exec((error, result) => {
        if (error) console.log(`\x1b[31m${error}\x1b[0m`);
        let apiKey;
        if (!result) {
          console.log(
            '\x1b[33mMain API Key does not exist, creating API Key',
            '\x1b[0m'
          );
          // if APP_CUSTOM_API_KEY is provided, the created key will be supplied value
          if (process.env.APP_CUSTOM_API_KEY) {
            apiKey = process.env.APP_CUSTOM_API_KEY;
          } else {
            apiKey = 'non-secure-api-key';
          }
          User.create(
            {
              username: apiKey,
              firstName: 'API',
              lastName: 'Key',
              password: 'x',
              email: 'api_key@domain.com',
              accessLevel: 'Main API',
              lastModifiedBy: null,
            },
            (error, key) => {
              if (error) {
                console.log(`\x1b[31m${error}\x1b[0m`);
              } else {
                console.log('\x1b[32mAPI Key:', key.username, '\x1b[0m');
                resolve(key);
              }
            }
          );
        } else {
          console.log(
            '\x1b[33mMain API Key already exists, using current',
            '\x1b[0m'
          );
          console.log('\x1b[32mAPI Key:', result.username, '\x1b[0m');
          resolve(result);
        }
      });
    });
  };
  const createAppAdminUser = apiUser => {
    return new Promise((resolve, reject) => {
      if (database.createAdminUser) {
        User.findOne({ username: 'ADMIN' }).exec((error, result) => {
          if (error) console.log(`\x1b[31m${error}\x1b[0m`);
          if (!result) {
            User.create(
              {
                username: 'ADMIN',
                firstName: 'Administrator',
                lastName: 'User',
                password: 'ADMIN',
                email: 'admin@domain.com',
                accessLevel: 'Admin',
                lastModifiedBy: apiUser._id,
              },
              (error, key) => {
                if (error) {
                  console.log(`\x1b[31m${error}\x1b[0m`);
                  resolve(false);
                } else {
                  console.log(
                    '\x1b[32mSuccessfully Created ADMIN user',
                    '\x1b[0m'
                  );
                  resolve(true);
                }
              }
            );
          } else {
            console.log('\x1b[33mADMIN user already created', '\x1b[0m');
            resolve(false);
          }
        });
      } else {
        resolve(true);
      }
    });
  };
  const startServer = () => {
    const app = express();

    app.use(logger('dev'));

    // Use the body-parser package in our application
    app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );

    app.use(bodyParser.json({ type: 'application/*+json' }));

    // Use the passport package in our application
    app.use(passport.initialize());

    app.all('/*', function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept,X-Access-Token,X-Key,Authorization'
      );
      if (req.method === 'OPTIONS') {
        res.status(200).end();
      } else {
        next();
      }
    });

    var landing = `<h1>Mock API</h1>`;

    app.get('/', (req, res) => {
      res.send(landing);
    });

    app.use('/api/beta/', api);

    // If no route is matched by now, it must be a 404
    app.use(function(req, res, next) {
      res.status(404).send('API Not Found');
    });

    // Start the server
    app.set('port', process.env.PORT || 3000);

    var server = app.listen(app.get('port'), function() {
      console.log('Express server listening on port ' + server.address().port);
    });
  };

  handlePreviousAPIKey()
    .then(createAppApiKey)
    .then(createAppAdminUser)
    .then(startServer);
});
