require('babel-register')({
  plugins: [
    [
      'babel-plugin-transform-require-ignore',
      {
        extensions: ['.less'],
      },
    ],
  ],
});

const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const ReactRouter = require('react-router-dom');

const StaticRouter = ReactRouter.StaticRouter;
const _ = require('lodash');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const api = require('./api.server').default;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const PORT = process.env.PORT || 80;
const baseTemplate = fs.readFileSync('./public/index.html');
const template = _.template(baseTemplate);
const App = require('./Components/App').default;

// Authentication
const ensureLoggedIn = () => (req, res, next) => {
  // isAuthenticated is set by `deserializeUser()`
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    res.status(401).send({
      success: false,
      message: 'You need to be authenticated to access this page!',
    });
  } else {
    next();
  }
};

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

passport.use(
  new LocalStrategy((username, password, cb) =>
    api
      .getUserByUsername(username)
      .then(localUser => {
        if (localUser[0]) {
          api
            .loginById(localUser[0]._id, password)
            .then(user => {
              if (!user) {
                return cb(null, false);
              }
              return cb(null, user);
            })
            .catch(err => {
              if (err) {
                return cb(err);
              }
            });
        } else {
          return cb(null, false);
        }
      })
      .catch(err => {
        if (err) {
          return cb(err);
        }
      })
  )
);

const server = express();

server.use(fileUpload());
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
server.use('/public', express.static('./public'));

// Initialize passport
server.use(cookieParser());
server.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 1 * 60 * 60 * 1000, // 24 hours
  })
);
server.use(passport.initialize());
server.use(passport.session());

server.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login?error' }),
  (req, res) => {
    res.redirect('/');
  }
);

server.get('/user', (req, res) => {
  res.json(req.user || {});
});

server.get('/logout', ensureLoggedIn(), (req, res) => {
  req.logout();
  res.redirect('/');
});

// Routes
server.delete('/image/delete', (req, res) => {
  const { target } = req.body;
  const file = `./public/uploads/${target}`;
  if (!fs.existsSync(file)) return res.status(200).send("File Doesn't Exist");
  fs.unlink(file, err => {
    if (err) return res.status(400).send(err);
    return res.sendStatus(200);
  });
});

server.put('/image/upload', (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
  const fileKeys = Object.keys(req.files);
  fileKeys.forEach(key => {
    const file = req.files[key];
    const dir = './public/uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    file.mv(`${dir}/${req.body[`fileName-${key}`]}`, err => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send('File Uploaded!');
    });
  });
});

server.use((req, res) => {
  const context = {};
  const body = ReactDOMServer.renderToString(
    React.createElement(
      StaticRouter,
      { location: req.url, context },
      React.createElement(App)
    )
  );
  if (context.url) {
    res.redirect(context.url);
  }

  res.write(template({ body }));
  res.end();
});

console.log('listening on port', PORT);
server.listen(PORT);
