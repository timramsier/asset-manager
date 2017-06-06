const mongoose = require('mongoose')
const shortId = require('shortid')
const Schema = mongoose.Schema

const assetSchema = Schema({
  _shortId: {type: String, unique: true, default: shortId.generate},
  tagId: String,
  assignedTo: String
})

const specSchema = Schema({
  _shortId: {type: String, unique: true, default: shortId.generate},
  key: String,
  value: String
})

const categorySchema = Schema({
  _shortId: {type: String, unique: true, default: shortId.generate},
  name: String,
  label: String,
  description: String,
  config: {
    faIcon: String,
    color: String,
    api: String,
    fallbackImage: String
  },
  models: [ { type: Schema.Types.ObjectId, ref: 'Model' } ]
})

const modelSchema = Schema({
  _parent: {type: String, ref: 'Category'},
  _shortId: {type: String, unique: true, default: shortId.generate},
  category: String,
  vendor: String,
  name: String,
  version: String,
  image: String,
  description: String,
  active: Boolean,
  specs: [ specSchema ],
  assets: [ assetSchema ]
})

module.exports = { assetSchema, modelSchema, categorySchema }
