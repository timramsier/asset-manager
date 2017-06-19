const mongoose = require('mongoose')
const faker = require('faker')
const generateData = require('./generateData')
const categoriesJS = require('../data/categories.js')
const { modelSchema, categorySchema, assetSchema } = require('./schema')
const { userSchema } = require('../auth/schema')
const User = mongoose.model('User', userSchema)
const Category = mongoose.model('Category', categorySchema)
const Asset = mongoose.model('Asset', assetSchema)
const Model = mongoose.model('Model', modelSchema)

const verbose = false
let modifier
User.findOne({username: '5503b8f9-d4ed-432d-b14a-3f061296f880'}).exec((err, result) => {
  if (err) console.log(err)
  modifier = result._id
})

const getAssetCategories = () => {
  return new Promise((resolve, reject) => {
    categoriesJS.forEach((asset) => {
      Category.create(asset, (err, category) => {
        Object.assign(category, {
          lastModifiedBy: modifier
        })
        if (err) {
          if (verbose) console.log(err)
          resolve(false)
        } else {
          if (verbose) console.log('Successfully saved:', category)
          resolve(true)
        }
      })
    })
  })
}

const clearData = () => {
  return new Promise((resolve, reject) => {
    Category.remove({}, (err) => {
      if (err) return console.log(err)
      if (verbose) console.log('Removing old category data')
    })
    Model.remove({}, (err) => {
      if (err) return console.log(err)
      if (verbose) console.log('Removing old model data')
    })
    Asset.remove({}, (err) => {
      if (err) return console.log(err)
      if (verbose) console.log('Removing old asset data')
    })
    resolve(true)
  })
}

const seedData = (success) => {
  return new Promise((resolve, reject) => {
    if (success) {
      Category.find({}, (err, result) => {
        if (err) return console.log(err)
        result.forEach((category) => {
          generateData.assetForDb(24).forEach((entry) => {
            console.log(entry)
            Object.assign(entry, {
              _parent: category._id,
              category: category.name,
              lastModifiedBy: modifier,
              lastModified: new Date()
            })
            Model.create(entry, (err, model) => {
              if (err) {
                if (verbose) console.log(err)
                resolve(false)
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
                    resolve(false)
                  }
                  if (verbose) console.log('Successfully created:', model)
                  resolve(true)
                })
                for (let i = 0; i < 5; i++) {
                  let data = {
                    _parent: model._id,
                    assetTag: Math.round(Math.random() * 1000000),
                    assignedTo: '593833420757cb8be83dce82',
                    status: 'deployed',
                    sn: faker.random.uuid().slice(0, 16),
                    po: Math.round(Math.random() * 10000000),
                    lastModifiedBy: modifier,
                    lastModified: new Date()
                  }
                  Asset.create(data, (err, asset) => {
                    if (err) {
                      if (verbose) console.log(err)
                      resolve(false)
                    } else {
                      Model.findOneAndUpdate(
                        { _id: model._id },
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
                      model.save((err) => {
                        if (err) {
                          if (verbose) console.log(err)
                          resolve(false)
                        }
                        if (verbose) console.log('Successfully created:', asset)
                        resolve(true)
                      })
                    }
                  })
                }
              }
            })
          })
        })
      })
    } else {
      if (verbose) console.log('Piped data:', success)
      resolve(false)
    }
  })
}
clearData().then(getAssetCategories).then(seedData)
