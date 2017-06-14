const mongoose = require('mongoose')
const shortId = require('shortid')
const Schema = mongoose.Schema

// Schema
const assetSchema = Schema({
  _shortId: {type: String, unique: true, default: shortId.generate},
  _parent: {type: String, ref: 'Model'},
  assetTag: String,
  assignedTo: {type: String, ref: 'User'},
  status: String,
  sn: String,
  po: String,
  lastModifiedBy: { type: String, ref: 'User' },
  lastModified: { type: Date, default: Date.now }
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
  models: [ { type: Schema.Types.ObjectId, ref: 'Model' } ],
  lastModifiedBy: { type: String, ref: 'User' },
  lastModified: { type: Date, default: Date.now }
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
  assets: [ { type: Schema.Types.ObjectId, ref: 'Asset' } ],
  lastModifiedBy: { type: String, ref: 'User' },
  lastModified: { type: Date, default: Date.now }
})

// indexes

assetSchema.index({
  assetTag: 'text',
  status: 'text',
  sn: 'text',
  po: 'text',
  assignedTo: 'text'
})

modelSchema.index({
  vendor: 'text',
  name: 'text',
  version: 'text',
  description: 'text'
})

module.exports = {
  assetSchema,
  modelSchema,
  categorySchema,
  modelModel: mongoose.model('Model', modelSchema),
  assetModel: mongoose.model('Asset', assetSchema),
  categoryModel: mongoose.model('Category', categorySchema)
}
