import React from 'react'
import { findDOMNode } from 'react-dom'
import FontAwesome from 'react-fontawesome'

const { func } = React.PropTypes

const AdminOptions = React.createClass({
  propTypes: {
    toggleMenuOpen: func,
    closeMenu: func,
    openMenu: func
  },
  getInitialState () {
    return ({
      selectedMenu: ''
    })
  },
  controlAdminMenu (action) {
    if (this._isMounted) {
      const elem = findDOMNode(this)
      switch (action) {
        case 'open':
          this.props.openMenu('admin')
          elem.classList.add('admin-full-view')
          break
        case 'close':
          this.props.closeMenu('admin')
          elem.classList.remove('admin-full-view')
      }
    }
  },
  setActiveMenu (menu) {
    let newState = this.state
    Object.assign(newState, {selectedMenu: menu})
    this.setState(newState)
  },
  componentDidMount () {
    this._isMounted = true
  },
  componentWillUnmount () {
    this._isMounted = false
  },
  render () {
    const openEffect = {
      onClick: (event) => {
        document.querySelectorAll('.admin-button.active')
        .forEach((elem) => {
          elem.classList.remove('active')
        })
        event.target.classList.add('active')
        event.preventDefault()
        this.controlAdminMenu('open')
      }
    }
    const closeEffect = {
      onClick: (event) => {
        event.preventDefault()
        document.querySelectorAll('.admin-button.active')
        .forEach((elem) => {
          elem.classList.remove('active')
        })
        this.controlAdminMenu('close')
      }
    }
    return (
      <div className='admin-menu'>
        <div className='admin-options'>
          <div className='admin-menu-controls'>
            <a className='admin-menu-close' {...closeEffect}>Close</a>
          </div>
          <h3>Administration</h3>
          <hr />
          <p className='thin-text'>You have permission to access the following preferences:</p>
          <ul className='button-list'>
            <li><a className='admin-button' data-target='general' {...openEffect}>
              <FontAwesome className='fa-fw' name='gear' />General Settings</a></li>
            <li><a className='admin-button' data-target='users' {...openEffect}>
              <FontAwesome className='fa-fw' name='user-o' />Manage Users</a></li>
            <li><a className='admin-button' data-target='stock' {...openEffect}>
              <FontAwesome className='fa-fw' name='laptop' />Manage Stock</a></li>
          </ul>
        </div>
        <div className='admin-content'>
          Test
        </div>
      </div>
    )
  }
})

export default AdminOptions
