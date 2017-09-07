import api from '../js/api'
import submit from './submit/submit'
import React from 'react' // eslint-disable-line no-unused-vars

export default {
  model: {
    columns: [
      {
        col: '_shortId',
        label: 'ID',
        type: 'text',
        minWidthPix: 80,
        maxWidthPer: 10
      },
      {
        col: 'category',
        label: 'Category',
        type: 'text',
        minWidthPix: 100,
        maxWidthPer: 10
      },
      {
        col: 'name',
        label: 'Name',
        type: 'text',
        minWidthPix: 120,
        maxWidthPer: 20
      },
      {
        col: 'vendor',
        label: 'Vendor',
        type: 'text',
        minWidthPix: 100,
        maxWidthPer: 15
      },
      {
        col: 'lastModifiedBy',
        subCol: 'displayName',
        label: 'Last Modified By',
        type: 'text',
        minWidthPix: 100,
        maxWidthPer: 15
      },
      {
        col: 'lastModified',
        label: 'Last Modified',
        type: 'date',
        minWidthPix: 80,
        maxWidthPer: 15
      },
      {
        col: 'remove',
        label: '',
        type: 'remove',
        minWidthPix: 50,
        maxWidthPer: 5
      },
      {
        col: 'edit',
        label: '',
        type: 'edit',
        minWidthPix: 50,
        maxWidthPer: 5
      }
    ],
    form: {
      header: {
        title: 'Model',
        description: 'Add or update a new model by filling out the following form'
      },
      structure: [
        {
          label: 'Model Name',
          key: 'name',
          type: 'text',
          placeholder: 'Enter the model name',
          description: 'This is the name of the model.',
          colspan: 6
        },
        {
          label: 'Manufacturer',
          key: 'vendor',
          type: 'text',
          placeholder: 'Enter the manufacturer name',
          description: 'This manufacturer name of who made this model.',
          colspan: 6
        },
        {
          label: 'Version',
          key: 'version',
          type: 'text',
          placeholder: 'Enter the product version',
          description: 'This is the version of the product (i.e. 2nd Gen, etc.).'
        },
        {
          label: 'Category',
          key: 'category',
          type: 'select',
          colspan: 6,
          description: 'Select the model category',
          options: (component) => {
            api.getCategories().then((categories) => {
              let options = categories.map(i => i.name)
              component.setState({ options })
            })
          },
          onChange: (event, component) => {
            let value = event.target.value
            api.getCategories({ name: value }).then((category) => {
              component.props.updateFormData({
                category: value,
                _parent: category[0]._id
              })
              component.props.checkForDiff('category')
            })
          }
        },
        {
          label: 'Active',
          key: 'active',
          type: 'select',
          description: 'Set whether this is an active model or not',
          colspan: 6,
          options: [
            true,
            false
          ]
        },
        {
          label: 'Image',
          key: 'image',
          type: 'image',
          description: 'Select an image for the model.',
          colspan: 6
        },
        {
          label: 'Description',
          key: 'description',
          type: 'textarea',
          placeholder: 'Enter the model description',
          description: 'Enter a short description for the model here.',
          colspan: 6,
          height: 195
        },
        {
          label: 'Specifications',
          key: 'specs',
          type: 'keyvalue',
          description: 'Add specs for the model here'
        },
        {
          key: '_parent',
          transformValue: (value) => {
            if (value instanceof Object) {
              return value._id
            } else {
              return value
            }
          }
        }
      ],
      submit: submit.model
    }
  },
  po: {
    columns: [
      {
        col: '_shortId',
        label: 'ID',
        type: 'text',
        minWidthPix: 80,
        maxWidthPer: 10
      },
      {
        col: 'poNumber',
        label: 'P.O.',
        type: 'text',
        minWidthPix: 60,
        maxWidthPer: 10
      },
      {
        col: 'bu',
        label: 'Business Unit',
        type: 'text',
        minWidthPix: 100,
        maxWidthPer: 15
      },
      {
        col: 'createdBy',
        subCol: 'displayName',
        label: 'Created By',
        type: 'text',
        minWidthPix: 100,
        maxWidthPer: 10
      },
      {
        col: 'created',
        label: 'Created',
        type: 'date',
        minWidthPix: 80,
        maxWidthPer: 15
      },
      {
        col: 'lastModifiedBy',
        subCol: 'displayName',
        label: 'Last Modified By',
        type: 'text',
        minWidthPix: 100,
        maxWidthPer: 10
      },
      {
        col: 'lastModified',
        label: 'Last Modified',
        type: 'date',
        minWidthPix: 80,
        maxWidthPer: 15
      },
      {
        col: 'remove',
        label: '',
        type: 'remove',
        minWidthPix: 50,
        maxWidthPer: 5
      },
      {
        col: 'edit',
        label: '',
        type: 'edit',
        minWidthPix: 50,
        maxWidthPer: 5
      }
    ],
    form: {
      header: {
        title: 'Purchase Orders',
        description: 'Create and update purchase orders and their assets.'
      },
      structure: [
        {
          label: 'P.O. Number',
          key: 'poNumber',
          type: 'text',
          placeholder: 'Enter the P.0. number',
          description: 'This is the purchase order number',
          colspan: 6
        },
        {
          label: 'Business Unit',
          key: 'bu',
          type: 'text',
          placeholder: 'Enter the business unit',
          description: 'This is the name of the business unit this belongs to',
          colspan: 6
        },
        {
          label: 'Assets',
          key: 'assets',
          type: 'asset',
          description: 'These are the assets associated with this P.O.'
        }
      ],
      submit: submit.po
    }
  },
  asset: {
    columns: [
      {
        col: '_shortId',
        label: 'ID',
        type: 'text',
        minWidthPix: 80,
        maxWidthPer: 10
      },
      {
        col: 'assetTag',
        label: 'Asset Tag',
        type: 'text',
        minWidthPix: 80,
        maxWidthPer: 10
      },
      {
        col: 'assignedTo',
        subCol: 'displayName',
        label: 'Assigned To',
        type: 'text',
        minWidthPix: 80,
        maxWidthPer: 10
      },
      {
        col: '_parent',
        subCol: 'name',
        label: 'Model',
        type: 'text',
        minWidthPix: 120,
        maxWidthPer: 15
      },
      {
        col: 'po',
        subCol: 'poNumber',
        label: 'P.O.',
        type: 'text',
        minWidthPix: 80,
        maxWidthPer: 10
      },
      {
        col: 'lastModifiedBy',
        subCol: 'displayName',
        label: 'Last Modified By',
        type: 'text',
        minWidthPix: 100,
        maxWidthPer: 15
      },
      {
        col: 'lastModified',
        label: 'Last Modified',
        type: 'date',
        minWidthPix: 80,
        maxWidthPer: 15
      },
      {
        col: 'remove',
        label: '',
        type: 'remove',
        minWidthPix: 50,
        maxWidthPer: 5
      },
      {
        col: 'edit',
        label: '',
        type: 'edit',
        minWidthPix: 50,
        maxWidthPer: 5
      }
    ],
    form: {
      header: {
        title: 'Assets',
        description: 'Update and assign individual assets.  If you need to create a new asset, you will need to use the Purchase Orders menu.'
      },
      disableNew: true,
      structure: [
        {
          label: 'Purchase Order',
          key: 'po',
          type: 'readonly',
          description: <span>The P.O. this asset was received from <em>(Read Only)</em></span>,
          transformValue: (value) => {
            if (value instanceof Object) {
              return value.poNumber
            } else {
              return value
            }
          },
          colspan: 6
        },
        {
          label: 'Serial Number',
          key: 'sn',
          type: 'readonly',
          description: <span>The serial number for this asset <em>(Read Only)</em></span>,
          colspan: 6
        }
      ]
    }
  },
  user: {
    columns: [
      {
        col: 'username',
        label: 'Username',
        type: 'text',
        minWidthPix: 10,
        maxWidthPer: 15
      },
      {
        col: 'firstName',
        label: 'First Name',
        type: 'text',
        minWidthPix: 10,
        maxWidthPer: 15
      },
      {
        col: 'lastName',
        label: 'Last Name',
        type: 'text',
        minWidthPix: 10,
        maxWidthPer: 15
      },
      {
        col: 'email',
        label: 'Email',
        type: 'text',
        minWidthPix: 120,
        maxWidthPer: 25
      },
      {
        col: 'accessLevel',
        label: 'Access Level',
        type: 'text',
        minWidthPix: 80,
        maxWidthPer: 15
      },
      {
        col: 'remove',
        label: '',
        type: 'remove',
        minWidthPix: 50,
        maxWidthPer: 5
      },
      {
        col: 'edit',
        label: '',
        type: 'edit',
        minWidthPix: 50,
        maxWidthPer: 5
      }
    ]
  }
}
