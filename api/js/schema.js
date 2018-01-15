const mongoose = require('mongoose');
const shortId = require('shortid');
const Schema = mongoose.Schema;

// Schema
const assetSchema = Schema({
  _shortId: { type: String, unique: true, default: shortId.generate },
  _parent: { type: String, required: true, ref: 'Model' },
  assetTag: { type: String, default: '' },
  assignedTo: { type: String, ref: 'User', default: null },
  status: { type: String, default: 'new' },
  sn: { type: String, default: '' },
  po: { type: String, ref: 'Po' },
  lastModifiedBy: { type: String, ref: 'User' },
  lastModified: { type: Date, default: Date.now },
});

const specSchema = Schema({
  _shortId: { type: String, unique: true, default: shortId.generate, sparse: true },
  key: String,
  value: String,
});

const categorySchema = Schema({
  _shortId: { type: String, unique: true, default: shortId.generate },
  name: { type: String, required: true },
  label: { type: String, required: true },
  description: String,
  config: {
    faIcon: { type: String, required: true },
    color: { type: String, required: true },
    api: { type: String, required: true },
    fallbackImage: { type: String, required: true },
  },
  models: [{ type: Schema.Types.ObjectId, ref: 'Model' }],
  lastModifiedBy: { type: String, ref: 'User' },
  lastModified: { type: Date, default: Date.now },
});

const modelSchema = Schema({
  _parent: { type: String, required: true, ref: 'Category' },
  _shortId: { type: String, unique: true, default: shortId.generate },
  category: { type: String, required: true },
  vendor: String,
  name: { type: String, required: true },
  version: String,
  image: String,
  description: String,
  active: { type: Boolean, default: false },
  specs: [specSchema],
  assets: [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
  lastModifiedBy: { type: String, ref: 'User' },
  lastModified: { type: Date, default: Date.now },
});

const poSchema = Schema({
  _shortId: { type: String, unique: true, default: shortId.generate },
  poNumber: { type: String, required: true },
  bu: { type: String, required: true },
  lastModifiedBy: { type: String, ref: 'User' },
  lastModified: { type: Date, default: Date.now },
  createdBy: { type: String, ref: 'User' },
  created: { type: Date, default: Date.now },
  assets: [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
});

// indexes

assetSchema.index({
  assetTag: 'text',
  status: 'text',
  sn: 'text',
  po: 'text',
  assignedTo: 'text',
});

modelSchema.index({
  vendor: 'text',
  name: 'text',
  version: 'text',
  description: 'text',
  category: 'text',
});

categorySchema.index({
  name: 'text',
  label: 'text',
  description: 'text',
  'config.faIcon': 'text',
  'config.color': 'text',
  'config.api': 'text',
});

poSchema.index({
  poNumber: 'text',
  bu: 'text',
});

// add property to allow 'search' url query usage in _.controller.js
assetSchema._custom = { textIndex: true };
modelSchema._custom = { textIndex: true };
categorySchema._custom = { textIndex: true };
poSchema._custom = { textIndex: true };

module.exports = {
  assetSchema,
  modelSchema,
  categorySchema,
  poSchema,
  modelModel: mongoose.model('Model', modelSchema),
  assetModel: mongoose.model('Asset', assetSchema),
  categoryModel: mongoose.model('Category', categorySchema),
  poModel: mongoose.model('Po', poSchema),
};
