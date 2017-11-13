const mongoose = require('mongoose');
const api = require('../routes/api.router');
const User = require('../auth/schema');

const setupDatabase = database => {
  const handlePreviousAPIKey = () => {
    return new Promise((resolve, reject) => {
      if (process.env.APP_CUSTOM_API_KEY) {
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
  return {
    handlePreviousAPIKey,
    createAppApiKey,
    createAppAdminUser,
  };
};

module.exports = setupDatabase;
