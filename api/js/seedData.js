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

// run config
const verbose = false

let modifier
User.findOne({username: '5503b8f9-d4ed-432d-b14a-3f061296f880'}).exec((err, result) => {
  if (err) console.log(err)
  modifier = result._id
})

const imageCategories = [
  'abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife',
  'fashion', 'people', 'nature', 'sports', 'technics', 'transport'
]
const _coinFlip = () => {
  return (Math.floor(Math.random() * 2) === 0)
}

// const _guid = () => {
//   return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1)
// }

const clearData = () => {
  return new Promise((resolve, reject) => {
    Category.collection.drop({}, (err) => {
      if (err) return console.log(err)
      if (verbose) console.log('Removing old category data')
    })
    Model.collection.drop({}, (err) => {
      if (err) return console.log(err)
      if (verbose) console.log('Removing old model data')
    })
    Asset.collection.drop({}, (err) => {
      if (err) return console.log(err)
      if (verbose) console.log('Removing old asset data')
    })
    Po.collection.drop({}, (err) => {
      if (err) return console.log(err)
      if (verbose) console.log('Removing old po')
    })
    setTimeout(() => resolve(true), 500)
  })
}

const addCategories = () => {
  return new Promise((resolve, reject) => {
    var categories = []
    categoriesJS.forEach((asset) => {
      Category.create(asset, (err, category) => {
        Object.assign(category, {
          lastModifiedBy: modifier
        })
        if (err) {
          if (verbose) console.log(err)
        } else {
          if (verbose) console.log('Successfully saved:', category)
          categories.push(category)
        }
      })
    })
    setTimeout(() => resolve(categories), 500)
  })
}

const addModels = (categories) => {
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
  return new Promise((resolve, reject) => {
    var models = []
    categories.forEach((category) => {
      let data = _createModels(12)
      data.forEach((model) => {
        Object.assign(model, {
          _parent: category._id,
          category: category.name,
          lastModifiedBy: modifier,
          lastModified: new Date()
        })
        Model.create(model, (err, model) => {
          if (err) {
            if (verbose) console.log(err)
            reject(err)
          } else {
            models.push(model)
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
            })
          }
        })
      })
    })
    setTimeout(() => resolve(models), 500)
  })
}

const addPOs = (models) => {
  return new Promise((resolve, reject) => {
    let pos = []
    for (let i = 0; i < 50; i++) {
      let po = {
        poNumber: Math.floor(Math.random() * 1000000),
        bu: 'IACP',
        lastModifiedBy: modifier,
        createdBy: modifier
      }
      Po.create(po, (err, po) => {
        if (err) {
          if (verbose) console.log(err)
        } else {
          if (verbose) console.log('Successfully saved:', po)
          pos.push(po)
        }
      })
    }
    let data = {
      pos,
      models
    }
    setTimeout(() => resolve(data), 500)
  })
}

const addAssets = (data) => {
  return new Promise((resolve, reject) => {
    const { models, pos } = data
    let assets = []
    for (let i = 0; i < 200; i++) {
      const mIndex = Math.floor(Math.random() * models.length)
      const pIndex = Math.floor(Math.random() * pos.length)
      let asset = {
        _parent: models[mIndex]._id,
        assetTag: Math.round(Math.random() * 1000000),
        assignedTo: '593833420757cb8be83dce82',
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
          assets.push(asset)
        }
      })
    }
    setTimeout(() => resolve(assets), 500)
  })
}

const seedData = () => {
  clearData()
  .then(addCategories)
  .then(addModels)
  .then(addPOs)
  .then(addAssets)
}

module.exports = seedData
