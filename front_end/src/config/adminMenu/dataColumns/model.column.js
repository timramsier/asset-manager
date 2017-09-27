/* eslint react/jsx-filename-extension: 0 */
import React from 'react'; // eslint-disable-line no-unused-vars
import { addDisplayName } from '../../transforms/functions';

export default [
  {
    col: '_shortId',
    label: 'ID',
    type: 'text',
    minWidthPix: 80,
    maxWidthPer: 10,
  },
  {
    col: 'category',
    label: 'Category',
    type: 'text',
    minWidthPix: 100,
    maxWidthPer: 10,
  },
  {
    col: 'name',
    label: 'Name',
    type: 'text',
    minWidthPix: 120,
    maxWidthPer: 20,
  },
  {
    col: 'vendor',
    label: 'Vendor',
    type: 'text',
    minWidthPix: 100,
    maxWidthPer: 15,
  },
  {
    col: 'lastModifiedBy',
    subCol: 'displayName',
    label: 'Last Modified By',
    type: 'text',
    minWidthPix: 100,
    maxWidthPer: 15,
    transformData: data => addDisplayName(data, 'lastModifiedBy'),
  },
  {
    col: 'lastModified',
    label: 'Last Modified',
    type: 'date',
    minWidthPix: 80,
    maxWidthPer: 15,
  },
  {
    col: 'remove',
    label: '',
    type: 'remove',
    minWidthPix: 50,
    maxWidthPer: 5,
  },
  {
    col: 'edit',
    label: '',
    type: 'edit',
    minWidthPix: 50,
    maxWidthPer: 5,
  },
];
