import React from 'react'
import FontAwesome from 'react-fontawesome'
import { Nav, NavItem } from 'react-bootstrap'
import DataTable from './DataTable'

const { string, arrayOf, shape, obj } = React.PropTypes

// Level 1 Controls
const AdminGroup = React.createClass({
  propTypes: {
    label: string,
    header: string,
    icon: string,
    menuOptions: arrayOf(shape({
      title: string,
      component: obj
    }))
  },
  getInitialState () {
    return ({
      menuSelected: 0
    })
  },
  render () {
    const handleSelect = (event) => {
      let newState = this.state
      Object.assign(newState, {menuSelected: event})
      this.setState(newState)
    }
    let navItemCount = 0
    let menuOptions = this.props.menuOptions || []
    return (
      <div className={`admin-${this.props.label}`}>
        <div className='header'>
          <h2><FontAwesome className='fa-fw' name={this.props.icon} /> {this.props.header}</h2>
        </div>
        <Nav bsStyle='pills' activeKey={this.state.menuSelected} onSelect={handleSelect}>
          {menuOptions.map((menu) => {
            return <NavItem key={`nav_${this.props.label}_${menu.title}`}
              eventKey={navItemCount++} title={menu.title}>{menu.title}</NavItem>
          })}
        </Nav>
        { this.props.menuOptions ? this.props.menuOptions[this.state.menuSelected].component : undefined}
      </div>
    )
  }
})

// Level 2 controls

const ModelMenu = React.createClass({
  render () {
    const columns = [
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
    ]
    return (
      <div className='model-menu'>
        <DataTable apiCall='models' columns={columns} />
      </div>
    )
  }
})

const POMenu = React.createClass({
  render () {
    const columns = [
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
    return (
      <div className='po-menu'>
        <DataTable apiCall='pos' columns={columns} />
      </div>
    )
  }
})

const AssetMenu = React.createClass({
  render () {
    const columns = [
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
    return (
      <div className='po-menu'>
        <DataTable apiCall='assets' columns={columns} />
      </div>
    )
  }
})

const UserMenu = React.createClass({
  render () {
    const columns = [
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
    return (
      <div className='user-menu'>
        <DataTable apiCall='users' columns={columns} />
      </div>
    )
  }
})

// export menus
export default {
  GeneralSettings: () =>
    <AdminGroup
      header='General Settings'
      icon='gear'
      label='general'
    />,
  IdentityManagement: () =>
    <AdminGroup
      header='Identity Management'
      icon='user-o'
      label='identity'
      menuOptions={[
        {title: 'Users', component: <UserMenu />}
      ]}
    />,
  StockManagement: () =>
    <AdminGroup
      header='Stock Management'
      icon='laptop'
      label='stock'
      menuOptions={[
        {title: 'Models', component: <ModelMenu />},
        {title: 'Assets', component: <AssetMenu />},
        {title: 'Purchase Orders', component: <POMenu />}
      ]}
    />
}
