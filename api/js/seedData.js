const mongoose = require('mongoose')
const { modelModel, categoryModel, assetModel, poModel } = require('./schema')
const faker = require('faker')
const { userSchema } = require('../auth/schema')
const User = mongoose.model('User', userSchema)
const Model = modelModel
const Category = categoryModel
const Asset = assetModel
const Po = poModel
const categoriesJS = require('../data/categories.js')

mongoose.Promise = global.Promise

// run config
const verbose = false
const database = {
  name: process.env.APP_DATABASE_NAME || 'app_default_database',
  host: process.env.APP_DATABASE_HOST || 'localhost',
  seed: process.env.APP_DATABASE_SEED || false,
  createAdminUser: process.env.APP_CREATE_ADMIN_USER || false,
  customApiKey: process.env.APP_CUSTOM_API_KEY || 'non-secure-api-key'
}

const imageCategories = [
  'abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife',
  'fashion', 'people', 'nature', 'sports', 'technics', 'transport'
]
const _coinFlip = () => {
  return (Math.floor(Math.random() * 2) === 0)
}

const getModifier = (key) => {
  console.log('1. getModifier')
  return new Promise((resolve, reject) => {
    User.findOne({username: key}).exec((err, result) => {
      if (err) console.log(err)
      resolve(result._id)
    })
  })
}

const clearData = (modifier) => {
  console.log('2. clearData')
  return Promise.all([
    new Promise((resolve, reject) => {
      Category.collection.drop({}, (err) => {
        if (err) return console.log(err)
        if (verbose) console.log('Removing old category data')
        resolve()
      })
    }),
    new Promise((resolve, reject) => {
      Model.collection.drop({}, (err) => {
        if (err) return console.log(err)
        if (verbose) console.log('Removing old model data')
        resolve()
      })
    }),
    new Promise((resolve, reject) => {
      Asset.collection.drop({}, (err) => {
        if (err) return console.log(err)
        if (verbose) console.log('Removing old asset data')
        resolve()
      })
    }),
    new Promise((resolve, reject) => {
      Po.collection.drop({}, (err) => {
        if (err) return console.log(err)
        if (verbose) console.log('Removing old po')
        resolve()
      })
    })
  ]).then(() => Promise.resolve(modifier))
}

const addCategories = (modifier) => {
  console.log('3. addCategories')
  let promArray = []
  categoriesJS.forEach((asset) => {
    promArray.push(new Promise((resolve, reject) => {
      Category.create(asset, (err, category) => {
        Object.assign(category, {
          lastModifiedBy: modifier
        })
        if (err) {
          if (verbose) console.log(err)
          reject(err)
        } else {
          if (verbose) console.log('Successfully saved:', category)
          resolve(category)
        }
      })
    }))
  })
  return Promise.all(promArray)
    .then((categories) => Promise.resolve({categories, modifier}))
}

const addModels = (data) => {
  const { categories, modifier } = data
  const _createModels = (count) => {
    var returnData = []
    for (let i = 0; i < count; i++) {
      let newData = {
        vendor: faker.company.companyName(),
        name: faker.commerce.productName(),
        version: faker.company.catchPhrase(),
        description: faker.lorem.sentence(),
        active: _coinFlip(),
        image: `http://lorempixel.com/640/480/${imageCategories[Math.round(Math.random() * 12)]}/${Math.ceil(Math.random() * 10)}/`,
        specs: [
          {
            key: faker.lorem.word(),
            value: faker.lorem.word()
          },
          {
            key: faker.lorem.word(),
            value: faker.lorem.word()
          },
          {
            key: faker.lorem.word(),
            value: faker.lorem.word()
          },
          {
            key: faker.lorem.word(),
            value: faker.lorem.word()
          },
          {
            key: faker.lorem.word(),
            value: faker.lorem.word()
          }
        ]
      }
      returnData.push(newData)
    }
    return returnData
  }
  let promArray = []
  categories.forEach((category) => {
    let data = _createModels(12)
    data.forEach((model) => {
      Object.assign(model, {
        _parent: category._id,
        category: category.name,
        lastModifiedBy: modifier,
        lastModified: new Date()
      })
      promArray.push(new Promise((resolve, reject) => {
        Model.create(model, (err, model) => {
          if (err) {
            if (verbose) console.log(err)
            reject(err)
          } else {
            Category.findOneAndUpdate(
              { _id: category._id },
              { $push: { models: model._id },
                $set: {
                  lastModifiedBy: modifier,
                  lastModified: new Date()
                }
              },
              (err, result) => {
                if (verbose) console.log(err)
              }
            )
            category.save((err) => {
              if (err) {
                if (verbose) console.log(err)
                reject(err)
              }
              if (verbose) console.log('Successfully created:', model)
              resolve(model)
            })
          }
        })
      }))
    })
  })
  console.log('4. addModels')
  return Promise.all(promArray)
      .then((models) => Promise.resolve({models, modifier}))
}

const addPOs = (data) => {
  const { models, modifier } = data
  let promArray = []
  for (let i = 0; i < 50; i++) {
    promArray.push(new Promise((resolve, reject) => {
      let po = {
        poNumber: Math.floor(Math.random() * 1000000),
        bu: 'IACP',
        lastModifiedBy: modifier,
        createdBy: modifier
      }
      Po.create(po, (err, po) => {
        if (err) {
          if (verbose) console.log(err)
          reject(err)
        } else {
          if (verbose) console.log('Successfully saved:', po)
          resolve(po)
        }
      })
    }))
  }
  console.log('5. addPOs')
  return Promise.all(promArray)
    .then(pos => Promise.resolve({ pos, models, modifier }))
}

const addAssets = (data) => {
  const { models, pos, modifier } = data
  let promArray = []
  for (let i = 0; i < 200; i++) {
    promArray.push(new Promise((resolve, reject) => {
      const mIndex = Math.floor(Math.random() * models.length)
      const pIndex = Math.floor(Math.random() * pos.length)
      let asset = {
        _parent: models[mIndex]._id,
        assetTag: Math.round(Math.random() * 1000000),
        status: 'deployed',
        sn: faker.random.uuid().slice(0, 16),
        po: pos[pIndex]._id,
        lastModifiedBy: modifier,
        lastModified: new Date()
      }
      Asset.create(asset, (err, asset) => {
        if (err) {
          if (verbose) console.log(err)
          reject(false)
        } else {
          Model.findOneAndUpdate(
            { _id: models[mIndex]._id },
            { $push: { assets: asset._id },
              $set: {
                lastModifiedBy: modifier,
                lastModified: new Date()
              }
            },
            (err, result) => {
              if (verbose) console.log(err)
            }
          )
          Po.findOneAndUpdate(
            { _id: pos[pIndex]._id },
            { $push: { assets: asset._id },
              $set: {
                lastModifiedBy: modifier,
                lastModified: new Date()
              }
            },
            (err, result) => {
              if (verbose) console.log(err)
            }
          )
          resolve(asset)
        }
      })
    }))
  }
  console.log('6. addAssets')
  return Promise.all(promArray)
    .then(assets => Promise.resolve(assets))
}

const seedData = (apiKey = false) => {
  if (!apiKey) {
    console.log('\x1b[31mMust provide API Key', '\x1b[0m')
  } else {
    console.log('0. seedData')
    return new Promise((resolve, reject) => {
      getModifier(apiKey)
      .then(clearData)
      .then(addCategories)
      .then(addModels)
      .then(addPOs)
      .then(addAssets)
      .then(() => {
        console.log('\x1b[32mSuccessfully seeded database', '\x1b[0m')
        console.log('\x1b[32mClosing seeding connection', '\x1b[0m')
        process.exit()
      })
    })
  }
}
console.log('\x1b[33mConnecting to MongoDB:', database, '\x1b[0m')

const dbUri = `mongodb://${database.host}/${database.name}`
mongoose.connect(dbUri)
var dbConnection = mongoose.connection
dbConnection.on('error', console.error.bind(console, 'MongoDB connection error:'))
dbConnection.on('connected', () => {
  seedData(database.customApiKey)
})
