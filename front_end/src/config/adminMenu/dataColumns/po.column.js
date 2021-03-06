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
    col: 'poNumber',
    label: 'P.O.',
    type: 'text',
    minWidthPix: 60,
    maxWidthPer: 10,
  },
  {
    col: 'bu',
    label: 'Business Unit',
    type: 'text',
    minWidthPix: 100,
    maxWidthPer: 15,
  },
  {
    col: 'createdBy',
    subCol: 'displayName',
    label: 'Created By',
    type: 'text',
    minWidthPix: 100,
    maxWidthPer: 10,
    transformData: data => addDisplayName(data, 'createdBy'),
  },
  {
    col: 'created',
    label: 'Created',
    type: 'date',
    minWidthPix: 80,
    maxWidthPer: 15,
  },
  {
    col: 'lastModifiedBy',
    subCol: 'displayName',
    label: 'Last Modified By',
    type: 'text',
    minWidthPix: 100,
    maxWidthPer: 10,
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
