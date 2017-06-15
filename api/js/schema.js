const mongoose = require('mongoose')
const shortId = require('shortid')
const Schema = mongoose.Schema

// Schema
const assetSchema = Schema({
  _shortId: {type: String, unique: true, default: shortId.generate},
  _parent: {type: String, required: true, ref: 'Model'},
  assetTag: {type: String, default: ''},
  assignedTo: {type: String, ref: 'User'},
  status: {type: String, default: 'new'},
  sn: {type: String, required: true, default: ''},
  po: {type: String, default: ''},
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
  name: {type: String, required: true},
  label: {type: String, required: true},
  description: String,
  config: {
    faIcon: {type: String, required: true},
    color: {type: String, required: true},
    api: {type: String, required: true},
    fallbackImage: {type: String, required: true}
  },
  models: [ { type: Schema.Types.ObjectId, ref: 'Model' } ],
  lastModifiedBy: { type: String, ref: 'User' },
  lastModified: { type: Date, default: Date.now }
})

const modelSchema = Schema({
  _parent: {type: String, required: true, ref: 'Category'},
  _shortId: {type: String, unique: true, default: shortId.generate},
  category: {type: String, required: true},
  vendor: String,
  name: {type: String, required: true},
  version: String,
  image: String,
  description: String,
  active: {type: Boolean, default: false},
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
