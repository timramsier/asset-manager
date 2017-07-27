import React from 'react'
import { Link } from 'react-router'
import FontAwesome from 'react-fontawesome'
import AdminOptions from './AdminOptions'
import { Navbar, Nav, NavItem, FormControl, FormGroup } from 'react-bootstrap'

const { func } = React.PropTypes

const TopNavigation = React.createClass({
  propTypes: {
    toggleMenuOpen: func,
    openMenu: func,
    closeMenu: func
  },
  render () {
    let buttonProperties = {
      onClick: (event) => {
        event.preventDefault()
        this.props.toggleMenuOpen('right')
      }
    }
    return (
      <div>
        <div className='navbar-top'>
          <Navbar fixedTop fluid collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link className='fill' to='/'>
                  <img className='img-responsive' src='/public/img/openstack_logo@0.5x.png' />
                  {/* <span className='brand-text'>stockbase</span> */}
                </Link>
              </Navbar.Brand>
            </Navbar.Header>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav pullRight>
                <NavItem eventKey={1} className='nav-text' {...buttonProperties}>
                  <FontAwesome name='gear' className='fa-fw' />
                  <span className='visible-xs-inline-block'>Preferences</span>
                </NavItem>
              </Nav>
              <Navbar.Form pullRight>
                <FormGroup>
                  <FormControl type='text' placeholder='Search' />
                </FormGroup>
              </Navbar.Form>
              <Navbar.Text pullRight className='hidden-xs'>
                Signed in as: <Navbar.Link href='#'>Tim Ramsier</Navbar.Link>
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
        </div>
        <AdminOptions
          toggleMenuOpen={this.props.toggleMenuOpen}
          closeMenu={this.props.closeMenu}
          openMenu={this.props.openMenu}
        />
      </div>
    )
  }
})

export default TopNavigation
