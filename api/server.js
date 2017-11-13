const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const api = require('./routes/api.router');
const User = require('./auth/schema');
const databaseInit = require('./js/databaseInit');
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

const {
  handlePreviousAPIKey,
  createAppApiKey,
  createAppAdminUser,
} = databaseInit(database);

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
