import React from 'react';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import { Navbar, Nav, NavItem, FormControl, FormGroup } from 'react-bootstrap';

const { func, object } = React.PropTypes;

const TopNavigation = React.createClass({
  propTypes: {
    toggleMenuOpen: func,
    openMenu: func,
    closeMenu: func,
    user: object,
  },
  render() {
    const buttonProperties = {
      onClick: event => {
        event.preventDefault();
        this.props.toggleMenuOpen('right');
      },
    };
    return (
      <div>
        <div className="navbar-top">
          <Navbar fixedTop fluid collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link className="fill" to="/">
                  <img
                    className="img-responsive"
                    src="/public/img/openstack_logo.png"
                    alt="logo"
                  />
                  {/* <span className='brand-text'>stockbase</span> */}
                </Link>
              </Navbar.Brand>
            </Navbar.Header>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav pullRight>
                {this.props.user &&
                  this.props.user.accessLevel === 'Admin' && (
                    <NavItem
                      eventKey={1}
                      className="nav-text"
                      {...buttonProperties}
                    >
                      <FontAwesome name="gear" className="fa-fw" />
                      <span className="visible-xs-inline-block">
                        Preferences
                      </span>
                    </NavItem>
                  )}
              </Nav>
              <Navbar.Form pullRight>
                <FormGroup>
                  <FormControl type="text" placeholder="Search" />
                </FormGroup>
              </Navbar.Form>
              <Navbar.Text pullRight className="hidden-xs">
                {this.props.user && this.props.user.username ? (
                  <span>
                    <Navbar.Link href="/logout">
                      Logout of {this.props.user.username}
                    </Navbar.Link>
                  </span>
                ) : (
                  <Navbar.Link href="/Login">Log in</Navbar.Link>
                )}
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </div>
    );
  },
});

export default TopNavigation;
