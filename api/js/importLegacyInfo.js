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

const statusMap = {
  'In Use': 'deployed',
  eWasted: 'e-wasted',
  'Not In Use': 'stock',
};

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
  return Promise.all(promArray).then(models => {
    data.models = models;
    return Promise.resolve({ data, modifier });
  });
};

const createPOs = ({ data, modifier }) => {
  const { assetsJson } = data;
  let promArray = [];

  // get just the PO numbers
  let pos = assetsJson
    .map(asset => {
      return asset.OraclePO || 'NA';
    })
    .filter((x, i, a) => a.indexOf(x) == i);

  pos.forEach(po => {
    console.log(po);
    promArray.push(
      Po.create({
        poNumber: po,
        bu: 'NA',
        lastModifiedBy: modifier,
        createdBy: modifier,
      }).catch(err => Promise.reject(err))
    );
  });

  return Promise.all(promArray).then(pos => {
    data.pos = pos;
    return Promise.resolve({ data, modifier });
  });
};

const createAssets = ({ data, modifier }) => {
  const { assetsJson, pos, models } = data;
  let promArray = [];
  assetJson.forEach(assetJson => {
    // get PO
    (() => Promise.resolve(pos.filter(p => p === assetJson.OraclePO)[0]))()
      // get model
      .then(po => {
        const model = models.filter(m => m.name === assetJson.ModelNbr)[0];
        return Promise.resolve({ po, model });
      })
      // get user
      .then(({ po, model }) => {
        if (assetJson.OwnerType === 'User') {
          const username = samiJson.filter(
            (s = s.SamiID === assetJson.OwnerSamiID)
          )[0];
          return User.findOne({ username })
            .exec()
            .then(user => Promise.resolve({ po, model, user }));
        } else {
          const user = null;
          return Promise.resolve();
        }
      })
      .then(({ po, model, user }) => {
        const asset = {
          _parent: model._id,
          assetTag: assetJson.AssetTag,
          status: statusMap[assetJson.AssetStatus],
          sn: assetJson.SerialNbr,
          po: po._id,
          assignedTo: user ? user._id : null,
        };
        console.log(asset)
        // promArray.push(Asset.create());
      });
  });
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
        .then(createPOs)
        .then(result => console.log(result))
        .then(endProcess);
    });
  });
};

module.exports = {
  connectAndImport,
};
