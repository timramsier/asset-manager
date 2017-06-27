import React from 'react'
import FontAwesome from 'react-fontawesome'
import { Nav, NavItem } from 'react-bootstrap'
import DataTable from './DataTable'

const { string } = React.PropTypes

// Stateless Functional Components
const Header = (props) => {
  return (
    <div className='header'>
      <h2><FontAwesome className='fa-fw' name={props.icon} /> {props.title}</h2>
    </div>
  )
}

Header.propTypes = {
  icon: string,
  title: string
}

// Level 1 Controls
const GeneralSettings = React.createClass({
  render () {
    return (
      <div className='admin-general'>
        <Header title='General Settings' icon='gear' />
      </div>
    )
  }
})

const UserManagement = React.createClass({
  render () {
    return (
      <div className='admin-users'>
        <Header title='User Management' icon='user-o' />
      </div>
    )
  }
})

const StockManagement = React.createClass({
  getInitialState () {
    return ({
      menuSelected: 1
    })
  },
  render () {
    const handleSelect = (event) => {
      let newState = this.state
      Object.assign(newState, {menuSelected: event})
      this.setState(newState)
    }
    return (
      <div className='admin-stock'>
        <Header title='Stock Management' icon='laptop' />
        <Nav bsStyle='pills' activeKey={this.state.menuSelected} onSelect={handleSelect}>
          <NavItem eventKey={1} title='Models'>Models</NavItem>
          <NavItem eventKey={2} title='Assets'>Assets</NavItem>
          <NavItem eventKey={3} title='Purchase Orders' disabled>Purchase Orders</NavItem>
        </Nav>
        {this.state.menuSelected === 1 ? <ModelsMenu /> : undefined}
        {this.state.menuSelected === 2 ? '2 Selected' : undefined}
        {this.state.menuSelected === 3 ? '3 Selected' : undefined}
      </div>
    )
  }
})

// Level 2 controls

const ModelsMenu = React.createClass({
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

export default {
  GeneralSettings,
  UserManagement,
  StockManagement
}
