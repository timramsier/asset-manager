/* eslint react/jsx-filename-extension: 0 */
import React from 'react'; // eslint-disable-line no-unused-vars
import api from '../../../js/api';
import submit from '../submit/submit';

export default {
  header: {
    title: 'Model',
    description: 'Add or update a new model by filling out the following form',
  },
  structure: [
    {
      label: 'Model Name',
      key: 'name',
      type: 'text',
      placeholder: 'Enter the model name',
      description: 'This is the name of the model.',
      colspan: 6,
    },
    {
      label: 'Manufacturer',
      key: 'vendor',
      type: 'text',
      placeholder: 'Enter the manufacturer name',
      description: 'This manufacturer name of who made this model.',
      colspan: 6,
    },
    {
      label: 'Version',
      key: 'version',
      type: 'text',
      placeholder: 'Enter the product version',
      description: 'This is the version of the product (i.e. 2nd Gen, etc.).',
    },
    {
      label: 'Category',
      key: 'category',
      type: 'select',
      colspan: 6,
      description: 'Select the model category',
      options: component => {
        api.getCategories().then(categories => {
          const options = categories.map(i => i.name);
          component.setState({ options });
        });
      },
      onChange: (event, component) => {
        const value = event.target.value;
        api.getCategories({ name: value }).then(category => {
          component.props.updateFormData({
            category: value,
            _parent: category[0]._id,
          });
          component.props.checkForDiff('category');
        });
      },
    },
    {
      label: 'Active',
      key: 'active',
      type: 'select',
      description: 'Set whether this is an active model or not',
      colspan: 6,
      options: [true, false],
    },
    {
      label: 'Image',
      key: 'image',
      type: 'image',
      description: 'Select an image for the model.',
      colspan: 6,
    },
    {
      label: 'Description',
      key: 'description',
      type: 'textarea',
      placeholder: 'Enter the model description',
      description: 'Enter a short description for the model here.',
      colspan: 6,
      height: 195,
    },
    {
      label: 'Specifications',
      key: 'specs',
      type: 'keyvalue',
      description: 'Add specs for the model here',
    },
    {
      key: '_parent',
      transformValue: value => {
        if (value instanceof Object) {
          return value._id;
        }
        return value;
      },
    },
  ],
  submit: submit.model,
};
