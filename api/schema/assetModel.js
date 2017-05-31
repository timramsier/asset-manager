const mongoose = require('mongoose')
const shortId = require('shortid')
const Schema = mongoose.Schema

const assetSchema = Schema({
  id: {type: String, unique: true, default: shortId.generate},
  tagId: String,
  assignedTo: String
})

const specSchema = Schema({
  id: Schema.Types.ObjectId,
  key: String,
  value: String
})

const assetModelSchema = Schema({
  id: {type: String, unique: true, default: shortId.generate},
  category: String,
  vendor: String,
  name: String,
  version: String,
  bgImage: String,
  description: String,
  active: Boolean,
  // specs: [ specSchema ],
  // assets: [ assetSchema ]
})

module.exports = { assetSchema, specSchema, assetModelSchema }
