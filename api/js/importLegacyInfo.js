const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const shortId = require("shortid");
const { modelModel, categoryModel, assetModel, poModel } = require("./schema");
const { userSchema } = require("../auth/schema");
const categories = require("../data/categories");
const { dbConfig, connectToMongo } = require("./databaseHelpers");

const Model = modelModel;
const Category = categoryModel;
const Asset = assetModel;
const Po = poModel;
const User = mongoose.model("User", userSchema);

const verbose = false;

// Maps
const categoryMap = [
  { name: "Client Computer Mac Laptop", category: "laptops" },
  { name: "Client Computer Mac Non-Laptop", category: "desktops" },
  { name: "Client Computer PC Laptop", category: "laptops" },
  { name: "Client Computer PC Non-Laptop", category: "desktops" },
  { name: "Docking Station", category: "miscellaneous" },
  { name: "Monitor", category: "miscellaneous" },
  { name: "Other", category: "miscellaneous" }
];

const statusMap = {
  "In Use": "deployed",
  eWasted: "e-wasted",
  "Not In Use": "stock"
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
      accessLevel: "Basic",
      lastModifiedBy: modifier
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
            lastModifiedBy: modifier
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
                    lastModified: new Date()
                  }
                },
                (err, category) => {
                  if (verbose) console.log(err);
                  category.save(err => {
                    if (err) {
                      if (verbose) console.log(err);
                      return Promise.reject(err);
                    }
                    if (verbose) console.log("Successfully created:", model);
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
      return asset.OraclePO || "NA";
    })
    .filter((x, i, a) => a.indexOf(x) == i);

  // create a catch-all po
  promArray.push(
    Po.create({
      poNumber: "NA",
      bu: "NA",
      lastModifiedBy: modifier,
      createdBy: modifier
    }).catch(err => Promise.reject(err))
  );

  pos.forEach(po => {
    promArray.push(
      Po.create({
        poNumber: po,
        bu: "NA",
        lastModifiedBy: modifier,
        createdBy: modifier
      }).catch(err => Promise.reject(err))
    );
  });

  return Promise.all(promArray).then(pos => {
    data.pos = pos;
    return Promise.resolve({ data, modifier });
  });
};

const wait = ms => new Promise(r => setTimeout(r, ms));

const createAssets = ({ data, modifier }) => {
  const { assetsJson, samiJson, pos, models } = data;
  let promArray = [];

  assetsJson.forEach(assetJson => {
    // get PO
    const getData = () =>
      new Promise(resolve => {
        const po =
          pos.filter(p => p.poNumber === `${assetJson.OraclePO}`)[0] ||
          pos.filter(p => p.poNumber === "NA")[0];
        const model = models.filter(m => m.name === assetJson.ModelNbr)[0];
        const user =
          samiJson.filter(s => s.SamiID === assetJson.OwnerSamiID)[0] || null;
        resolve({ po, model, user });
      });

    const getUserInfo = ({ po, model, user }) => {
      return new Promise(resolve => {
        if (user !== null) {
          return User.findOne({
            username: { $regex: user["Common Name"], $options: "i" }
          }).then(user => {
            resolve({ po, model, user });
          });
        } else {
          resolve({ po, model, user: null });
        }
      });
    };

    const createAsset = ({ po, model, user }) => {
      return new Promise((resolve, reject) => {
        const asset = {
          _parent: model._id,
          assetTag: assetJson.AssetTag,
          status: statusMap[assetJson.AssetStatus],
          sn: assetJson.SerialNbr,
          po: po._id,
          assignedTo: user ? user._id : null,
          lastModifiedBy: modifier
        };
        Asset.create(asset)
          .then(asset => {
            Po.findOneAndUpdate(
              { _id: po._id },
              {
                $push: { assets: asset._id },
                $set: {
                  lastModifiedBy: modifier,
                  lastModified: new Date()
                }
              },
              (err, po) => {
                if (verbose) console.log(err);
                po.save(err => {
                  if (err) {
                    if (verbose) console.log(err);
                    return reject(err);
                  }
                  Model.findOneAndUpdate(
                    { _id: asset._parent },
                    {
                      $push: { assets: asset._id },
                      $set: {
                        lastModifiedBy: modifier,
                        lastModified: new Date()
                      }
                    },
                    (err, model) => {
                      if (verbose) console.log(err);
                      model.save(err => {
                        if (err) {
                          if (verbose) console.log(err);
                          return reject(err);
                        }
                        if (verbose)
                          console.log("Successfully created:", asset);
                        return resolve(asset);
                      });
                    }
                  );
                });
              }
            );
          })
          .catch(err => reject(err));
      });
    };

    promArray.push(
      getData()
        .then(getUserInfo)
        .then(createAsset)
        .catch(console.log.bind(console))
    );
  });

  return Promise.all(promArray).then(assets => {
    data.assets = assets;
    return Promise.resolve({ data, modifier });
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
      username: dbConfig.customApiKey
    }).then(apiKey => {
      getCategories({ data, modifier: apiKey._id })
        .then(createUsers)
        .then(createModels)
        .then(createPOs)
        .then(createAssets)
        .then(result =>
          console.log(
            `Created:\nModels:\t${result.data.models.length ||
              0}\nPOs:\t${result.data.pos.length || 0}\nAssets:\t${result.data
              .assets.length || 0}`
          )
        )
        .then(endProcess)
        .catch(err => console.error(err));
    });
  });
};

module.exports = {
  connectAndImport
};
