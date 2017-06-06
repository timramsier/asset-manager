const mongoose = require('mongoose')
const generateData = require('./generateData')
const assetsJS = require('../data/assets.js')
const { modelSchema, categorySchema } = require('./schema')

const Category = mongoose.model('Category', categorySchema)
const Model = mongoose.model('Model', modelSchema)

const verbose = false

Category.remove({}, (err) => {
  if (err) return console.log(err)
  if (verbose) console.log('Removing old category data')
})
Model.remove({}, (err) => {
  if (err) return console.log(err)
  if (verbose) console.log('Removing old model data')
})

const getAssetCategories = () => {
  return new Promise((resolve, reject) => {
    assetsJS.forEach((asset) => {
      Category.create(asset, (err, category) => {
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

const seedData = (success) => {
  return new Promise((resolve, reject) => {
    if (success) {
      Category.find({}, (err, result) => {
        if (err) return console.log(err)
        result.forEach((category) => {
          generateData.assetForDb(28).forEach((entry) => {
            Object.assign(entry, {_parent: category._id, category: category.name})
            console.log(entry)
            Model.create(entry, (err, model) => {
              if (err) {
                if (verbose) console.log(err)
                resolve(false)
              } else {
                Category.findOneAndUpdate(
                  { _id: category._id },
                  { $push: { models: model._id } },
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
getAssetCategories().then(seedData)
