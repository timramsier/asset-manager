const mongoose = require('mongoose')
const shortId = require('shortid')
const Schema = mongoose.Schema

const assetSchema = Schema({
  _shortId: {type: String, unique: true, default: shortId.generate},
  tagId: { type: String, text: true },
  assignedTo: { type: String, text: true }
})

const specSchema = Schema({
  _shortId: {type: String, unique: true, default: shortId.generate},
  key: { type: String, text: true },
  value: { type: String, text: true }
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
  category: { type: String, text: true },
  vendor: { type: String, text: true },
  name: { type: String, text: true },
  version: { type: String, text: true },
  image: String,
  description: { type: String, text: true },
  active: Boolean,
  specs: [ specSchema ],
  assets: [ assetSchema ]
})

modelSchema.index({
  vendor: 'text',
  name: 'text',
  version: 'text',
  description: 'text'
})

module.exports = { assetSchema, modelSchema, categorySchema }
