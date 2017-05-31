const mongoose = require('mongoose')
var generateData = require('./generateData')
const assetConfig = require('../data/assets.js')
const assetClassSchema = require('../schema/AssetClass')
const { assetModelSchema } = require('../schema/assetModel')

const AssetClass = mongoose.model('asset_class', assetClassSchema)
const AssetModel = mongoose.model('asset_model', assetModelSchema)

const database = {
  defaults: {
    name: 'test_assets',
    host: 'localhost'
  }
}
mongoose.connect(`mongodb://${database.defaults.host}/${database.defaults.name}`)

AssetClass.remove({}, (err) => {
  if (err) return console.log(err)
  console.log('Removing old category data')
})
AssetModel.remove({}, (err) => {
  if (err) return console.log(err)
  console.log('Removing old model data')
})

const getAssetCategories = () => {
  return new Promise((resolve, reject) => {
    assetConfig.forEach((config) => {
      let assetClass = new AssetClass(config)
      assetClass.save((err) => {
        if (err) {
          console.log(err)
        }
        console.log('Successfully saved:', config)
      })
    })
    resolve(true)
  })
}

const seedData = (success) => {
  return new Promise((resolve, reject) => {
    if (success) {
      AssetClass.find({}, (err, result) => {
        if (err) return console.log(err)
        result.forEach((classType) => {
          generateData.assetForDb(1).forEach((entry) => {
            Object.assign(entry, {category: classType.categoryId})
            let assetModel = new AssetModel(entry)
            assetModel.save((err) => {
              if (err) return console.log(err)
              console.log(entry)
            })
            console.log(assetModel)
          })
        })
      })
    } else {
      console.log('Piped data:', success)
    }
    resolve(true)
  })
}
getAssetCategories().then(seedData)
