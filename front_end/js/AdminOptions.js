import React from 'react'
import { Link } from 'react-router'
import FontAwesome from 'react-fontawesome'

const AdminOptions = React.createClass({
  render () {
    return (
      <div className='admin-options'>
        <h3>Administration</h3>
        <hr />
        <p className='thin-text'>You have permission to access the following preferences:</p>
        <ul className='button-list'>
          <li><Link to='#'><FontAwesome className='fa-fw' name='gear' /> General Settings</Link></li>
          <li><Link to='#'><FontAwesome className='fa-fw' name='user-o' /> Manage Users</Link></li>
          <li><Link to='#'><FontAwesome className='fa-fw' name='laptop' /> Manage Assets</Link></li>
        </ul>
      </div>
    )
  }
})

export default AdminOptions
