const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const shortId = require('shortid');
const { modelModel, categoryModel, assetModel, poModel } = require('./schema');
const { userSchema } = require('../auth/schema');
const categories = require('../data/categories');
const { dbConfig, connectToMongo } = require('./databaseHelpers');

const Model = modelModel;
const Category = categoryModel;
const Asset = assetModel;
const Po = poModel;
const User = mongoose.model('User', userSchema);

const verbose = false;

// Maps
const categoryMap = [
  { name: 'Client Computer Mac Laptop', category: 'laptops' },
  { name: 'Client Computer Mac Non-Laptop', category: 'desktops' },
  { name: 'Client Computer PC Laptop', category: 'laptops' },
  { name: 'Client Computer PC Non-Laptop', category: 'desktops' },
  { name: 'Docking Station', category: 'miscellaneous' },
  { name: 'Monitor', category: 'miscellaneous' },
  { name: 'Other', category: 'miscellaneous' },
];

const createUsers = ({ data, modifier }) => {
  const { usersJson } = data;
  const formattedUsers = usersJson.map(user => {
    return {
      username: user.SamAccountName,
      email: user.Mail,
      firstName: user.GivenName,
      lastName: user.Surname,
      password: shortId.generate(),
      accessLevel: 'Basic',
      lastModifiedBy: modifier,
    };
  });
  formattedUsers.forEach(user => {
    User.create(user);
  });
  return Promise.resolve({ data, modifier });
};

const getCategories = ({ data, modifier }) => {
  return Category.find({})
    .exec()
    .then(categories => {
      data.categories = categories;
      return Promise.resolve({ data, modifier });
    })
    .catch(err => Promise.reject(err));
};

const createModels = ({ data, modifier }) => {
  const { modelsJson, categories } = data;
  let promArray = [];
  modelsJson.forEach(modelJson => {
    promArray.push(
      Category.find({ label: modelJson.Category })
        .exec()
        .then(category => {
          const model = {
            _parent: category[0]._id,
            category: category[0].label,
            vendor: modelJson.Manufacturer,
            name: modelJson.ModelNbr,
            version: modelJson.ModelNbr,
            description: modelJson.Description,
            specs: [],
            active: true,
            lastModifiedBy: modifier,
          };
          return Promise.resolve({ model, category });
        })
        .then(({ model, category }) => {
          return Model.create(model, (err, model) => {
            if (err) {
              if (verbose) console.log(err);
              Promise.reject(err);
            } else {
              Category.findOneAndUpdate(
                { _id: category[0]._id },
                {
                  $push: { models: model._id },
                  $set: {
                    lastModifiedBy: modifier,
                    lastModified: new Date(),
                  },
                },
                (err, category) => {
                  if (verbose) console.log(err);
                  category.save(err => {
                    if (err) {
                      if (verbose) console.log(err);
                      return Promise.reject(err);
                    }
                    if (verbose) console.log('Successfully created:', model);
                    return Promise.resolve(model);
                  });
                }
              );
            }
          });
        })
        .catch(err => Promise.reject(err))
    );
  });
  return Promise.all(promArray);
};

const endProcess = () => {
  process.exit();
};

const connectAndImport = ({ usersPath, assetsPath, samiPath, modelsPath }) => {
  const usersJson = require(usersPath) || [];
  const assetsJson = require(assetsPath) || [];
  const samiJson = require(samiPath) || [];
  const modelsJson = require(modelsPath) || [];

  const data = { usersJson, assetsJson, samiJson, modelsJson };

  connectToMongo(() => {
    User.findOne({
      username: dbConfig.customApiKey,
    }).then(apiKey => {
      getCategories({ data, modifier: apiKey._id })
        .then(createModels)
        .then(result => console.log(result))
        .then(endProcess);
    });
  });
};

module.exports = {
  connectAndImport,
};
