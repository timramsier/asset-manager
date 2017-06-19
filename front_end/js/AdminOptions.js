import React from 'react'
import { Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

const AdminOptions = React.createClass({
  render () {
    return (
      <div className='admin-options'>
        <h3>Administration</h3>
        <hr />
        <p className='thin-text'>You have permission to execute the following actions:</p>
        <ul className='button-list'>
          <li><Button className='admin-button'><FontAwesome className='fa-fw' name='plus-square-o' /> Add Model</Button></li>
          <li><Button className='admin-button'><FontAwesome className='fa-fw' name='edit' /> Modify Model</Button></li>
          <li><Button className='admin-button'><FontAwesome className='fa-fw' name='minus-square-o' /> Remove Model</Button></li>
        </ul>
      </div>
    )
  }
})

export default AdminOptions
