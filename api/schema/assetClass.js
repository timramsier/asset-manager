const mongoose = require('mongoose')
const shortId = require('shortid')
const Schema = mongoose.Schema

const { assetModelSchema } = require('./assetModel')

const assetClassSchema = Schema({
  name: String,
  description: String,
  categoryId: {type: String, unique: true, default: shortId.generate},
  models: [ assetModelSchema ]
})

module.exports = assetClassSchema
