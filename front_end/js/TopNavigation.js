import React from 'react'
import FontAwesome from 'react-fontawesome'
import { Navbar, Nav, NavItem, FormControl, FormGroup } from 'react-bootstrap'

const TopNavigation = React.createClass({
  render () {
    return (
      <div className='navbar-top'>
        <Navbar fixedTop fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a className='fill' href='/'>
                <img className='img-responsive' src='/public/img/barcode_dark.png' />
                <span className='brand-text'>stockbase</span>
              </a>
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav pullRight>
              <NavItem eventKey={1} href='#'>
                <FontAwesome name='gear' size='2x' className='fa-fw' />
              </NavItem>
            </Nav>
            <Navbar.Form pullRight>
              <FormGroup>
                <FormControl type='text' placeholder='Search' />
              </FormGroup>
            </Navbar.Form>
            <Navbar.Text pullRight>
              Signed in as: <Navbar.Link href='#'>Tim Ramsier</Navbar.Link>
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
})

export default TopNavigation
