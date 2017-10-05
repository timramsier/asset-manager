/* eslint react/jsx-filename-extension: 0 */
import React from 'react'; // eslint-disable-line no-unused-vars
import submit from '../submit/submit';

export default {
  header: {
    title: 'User Account',
    description: 'Create and update user accounts from here.',
  },
  structure: [
    {
      label: 'First Name',
      key: 'firstName',
      type: 'text',
      placeholder: 'First Name',
      description: 'This is the first name of the user',
      colspan: 6,
    },
    {
      label: 'Last Name',
      key: 'lastName',
      type: 'text',
      placeholder: 'Last Name',
      description: 'This is the last name of the user',
      colspan: 6,
    },
    {
      label: 'Access Level',
      key: 'accessLevel',
      type: 'select',
      description: 'Select the permission level of the user',
      options: ['User', 'Admin'],
      colspan: 6,
    },
  ],
  submit: submit.user,
};
