import api from '../js/api'

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
    formStructure: [
      {
        label: 'Category',
        key: 'category',
        type: 'select',
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
        options: [
          true,
          false
        ]
      },
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
        label: 'Description',
        key: 'description',
        type: 'textarea',
        placeholder: 'Enter the model description',
        description: 'Enter a short description for the model here.'
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
    ]
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
    ]
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
    ]
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
