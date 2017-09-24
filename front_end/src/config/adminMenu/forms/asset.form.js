/* eslint react/jsx-filename-extension: 0 */
import React from 'react'; // eslint-disable-line no-unused-vars
import api from '../../../js/api';

export default {
  header: {
    title: 'Assets',
    description:
      'Update and assign individual assets.  If you need to create a new asset, you will need to use the Purchase Orders menu.',
  },
  disableNew: true,
  structure: [
    {
      label: 'Purchase Order',
      key: 'po',
      type: 'readonly',
      description: (
        <span>
          The P.O. this asset was received from <em>(Read Only)</em>
        </span>
      ),
      transformValue: value => {
        if (value instanceof Object) {
          return value.poNumber;
        }
        return value;
      },
      colspan: 6,
    },
    {
      label: 'Model',
      key: '_parent',
      type: 'readonly',
      description: (
        <span>
          What model this asset is <em>(Read Only)</em>
        </span>
      ),
      transformValue: value => value.name,
      colspan: 6,
    },
    {
      label: 'Category',
      key: '_parent',
      type: 'readonly',
      description: (
        <span>
          What category this asset belongs to <em>(Read Only)</em>
        </span>
      ),
      transformValue: value => value.category,
      colspan: 6,
    },
    {
      label: 'Serial Number',
      key: 'sn',
      type: 'readonly',
      description: (
        <span>
          The serial number for this asset <em>(Read Only)</em>
        </span>
      ),
      colspan: 6,
    },
    {
      label: 'Asset Tag',
      key: 'assetTag',
      type: 'text',
      description: 'The adhered asset tag number for the asset',
      colspan: 6,
    },
    {
      label: 'Status',
      key: 'status',
      type: 'select',
      options: ['new', 'stock', 'deployed', 'e-wasted'],
      description: 'The status of the asset',
      colspan: 6,
    },
    {
      label: 'Assigned To',
      key: 'assignedTo',
      type: 'select',
      description: 'The name of the employee the asset is assigned to',
      nullOption: {
        label: 'Unassigned',
        value: 'Unassigned',
      },
      options: component => {
        api.getUsers().then(users => {
          const options = users.map(i => i.username);
          component.setState({ options });
        });
      },
      onChange: (event, component) => {
        const value = event.target.value;
        let assignedTo;
        if (value === null || value === 'null' || value === 'Unassigned') {
          console.log(value);
          assignedTo = null;
          component.props.updateFormData({
            assignedTo,
          });
          component.props.checkForDiff('assignedTo');
        } else {
          api.getUserByUsername(value).then(user => {
            assignedTo = user[0];
            delete assignedTo.password;
            delete assignedTo.displayName;
            component.props.updateFormData({
              assignedTo,
            });
            component.props.checkForDiff('assignedTo');
          });
        }
      },
      transformValue: value => {
        if (
          value === null ||
          value === 'null' ||
          value.displayName === 'Unassigned'
        ) {
          return 'Unassigned';
        }
        return value.username;
      },
      colspan: 12,
    },
  ],
};
