import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Nav, NavItem } from 'react-bootstrap';
import DataTable from './DataTable';
import config from '../../config/adminMenuSettings';

const { string, arrayOf, shape, object } = React.PropTypes;

// Level 1 Controls
const AdminGroup = React.createClass({
  propTypes: {
    label: string,
    header: string,
    icon: string,
    menuOptions: arrayOf(
      shape({
        title: string,
        component: object,
      })
    ),
  },
  getInitialState() {
    return {
      menuSelected: 0,
    };
  },
  render() {
    const handleSelect = event => {
      const newState = this.state;
      Object.assign(newState, { menuSelected: event });
      this.setState(newState);
    };
    let navItemCount = 0;
    const menuOptions = this.props.menuOptions || [];
    return (
      <div className={`admin-${this.props.label}`}>
        <div className="header">
          <h2>
            <FontAwesome className="fa-fw" name={this.props.icon} />{' '}
            {this.props.header}
          </h2>
        </div>
        <Nav
          bsStyle="pills"
          activeKey={this.state.menuSelected}
          onSelect={handleSelect}
        >
          {menuOptions.map(menu => (
            <NavItem
              key={`nav_${this.props.label}_${menu.title}`}
              eventKey={navItemCount++}
              title={menu.title}
            >
              {menu.title}
            </NavItem>
          ))}
        </Nav>
        {this.props.menuOptions
          ? this.props.menuOptions[this.state.menuSelected].component
          : undefined}
      </div>
    );
  },
});

// Level 2 controls
const ModelMenu = props => (
  <div className="model-menu">
    <DataTable apiCall="models" {...config.model} {...props} showTotal />
  </div>
);

const POMenu = React.createClass({
  render() {
    return (
      <div className="po-menu">
        <DataTable apiCall="pos" {...config.po} showTotal />
      </div>
    );
  },
});

const AssetMenu = React.createClass({
  render() {
    return (
      <div className="po-menu">
        <DataTable apiCall="assets" {...config.asset} showTotal />
      </div>
    );
  },
});

const UserMenu = React.createClass({
  render() {
    return (
      <div className="user-menu">
        <DataTable apiCall="users" {...config.user} showTotal />
      </div>
    );
  },
});

// export menus
export default {
  GeneralSettings: props => (
    <AdminGroup
      header="General Settings"
      icon="gear"
      label="general"
      {...props}
    />
  ),
  IdentityManagement: props => (
    <AdminGroup
      header="Identity Management"
      icon="user-o"
      label="identity"
      menuOptions={[{ title: 'Users', component: <UserMenu {...props} /> }]}
    />
  ),
  StockManagement: props => (
    <AdminGroup
      header="Stock Management"
      icon="laptop"
      label="stock"
      menuOptions={[
        { title: 'Models', component: <ModelMenu {...props} /> },
        { title: 'Assets', component: <AssetMenu {...props} /> },
        { title: 'Purchase Orders', component: <POMenu {...props} /> },
      ]}
      {...props}
    />
  ),
};
