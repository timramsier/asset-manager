/* eslint react/jsx-filename-extension: 0 */
import React from 'react'; // eslint-disable-line no-unused-vars
import submit from '../submit/submit';

export default {
  header: {
    title: 'Purchase Orders',
    description: 'Create and update purchase orders and their assets.',
  },
  structure: [
    {
      label: 'P.O. Number',
      key: 'poNumber',
      type: 'text',
      placeholder: 'Enter the P.0. number',
      description: 'This is the purchase order number',
      colspan: 6,
    },
    {
      label: 'Business Unit',
      key: 'bu',
      type: 'text',
      placeholder: 'Enter the business unit',
      description: 'This is the name of the business unit this belongs to',
      colspan: 6,
    },
    {
      label: 'Assets',
      key: 'assets',
      type: 'asset',
      description: 'These are the assets associated with this P.O.',
    },
  ],
  submit: submit.po,
};
