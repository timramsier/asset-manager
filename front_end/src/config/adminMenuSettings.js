/* eslint react/jsx-filename-extension: 0 */
import React from 'react'; // eslint-disable-line no-unused-vars
import {
  modelForm,
  poForm,
  assetForm,
  userForm,
} from './adminMenu/forms/forms.js';
import {
  modelColumn,
  poColumn,
  assetColumn,
  userColumn,
} from './adminMenu/dataColumns/columns.js';

export default {
  model: {
    columns: modelColumn,
    form: modelForm,
  },
  po: {
    columns: poColumn,
    form: poForm,
  },
  asset: {
    columns: assetColumn,
    form: assetForm,
  },
  user: {
    columns: userColumn,
    form: userForm,
  },
};
