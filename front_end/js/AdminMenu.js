import React from 'react'
import FontAwesome from 'react-fontawesome'
import { Nav, NavItem } from 'react-bootstrap'
import DataTable from './DataTable'
import config from '../config/adminMenuSettings'

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
    const { columns, formStructure } = config.model
    return (
      <div className='model-menu'>
        <DataTable
          formStructure={formStructure}
          apiCall='models'
          columns={columns}
          showTotal
        />
      </div>
    )
  }
})

const POMenu = React.createClass({
  render () {
    const { columns } = config.po
    return (
      <div className='po-menu'>
        <DataTable apiCall='pos' columns={columns} showTotal />
      </div>
    )
  }
})

const AssetMenu = React.createClass({
  render () {
    const { columns } = config.asset
    return (
      <div className='po-menu'>
        <DataTable apiCall='assets' columns={columns} showTotal />
      </div>
    )
  }
})

const UserMenu = React.createClass({
  render () {
    const { columns } = config.user
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
