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
      label: 'Username',
      key: 'username',
      type: 'text',
      placeholder: 'Username',
      description: 'Enter a unique username for this account',
      colspan: 6,
    },
    {
      label: 'Email Address',
      key: 'email',
      type: 'text',
      placeholder: 'Email Address',
      description: "Enter te user's email address",
      colspan: 6,
    },
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
    {
      label: 'Password',
      key: 'password',
      type: 'password',
      description:
        'Enter a password that has at least three of the following: uppercase, lowercase, number, and/or special character',
      colspan: 6,
    },
  ],
  submit: submit.user,
};
