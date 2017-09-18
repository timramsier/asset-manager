import React from 'react';
import MenuButton from './MenuButton';
import ExpandButton from './ExpandButton';

const { array, func } = React.PropTypes;
const LeftNavigation = React.createClass({
  propTypes: {
    categories: array,
    menuOptions: array,
    toggleMenuOpen: func,
    closeMenu: func,
  },
  getInitialState() {
    return {
      expanded: false,
    };
  },
  toggleMenu() {
    this.setState({ expanded: !this.state.expanded });
    this.props.toggleMenuOpen('left');
  },
  render() {
    const { categories, menuOptions } = this.props;
    return (
      <div className={`navbar-side open-${this.state.expanded}`}>
        <nav className="nav">
          <ExpandButton
            toggleMenu={this.toggleMenu}
            expanded={this.state.expanded}
          />
          <ul className="nav-list">
            <MenuButton
              bgColor="#666"
              linkTo="/show/all"
              label="All"
              name="All"
              faIcon="globe"
              expanded={this.state.expanded}
            />
            {categories
              .sort((a, b) => {
                if (a.label < b.label) return -1;
                if (a.label > b.label) return 1;
                return 0;
              })
              .map(category => {
                const { name, label, _id } = category;
                const { color, faIcon, api } = category.config;
                return (
                  <MenuButton
                    key={`button_${_id}`}
                    bgColor={color}
                    linkTo={`/${api}/${name}`}
                    name={name}
                    label={label}
                    faIcon={faIcon}
                    expanded={this.state.expanded}
                  />
                );
              })}
            {menuOptions
              .sort((a, b) => {
                if (a.label < b.label) return -1;
                if (a.label > b.label) return 1;
                return 0;
              })
              .map(option => {
                const { name, label, faIcon, color, api, id } = option;
                return (
                  <MenuButton
                    key={`button_${id}`}
                    bgColor={color}
                    linkTo={`/${api}/${name}`}
                    name={name}
                    label={label}
                    faIcon={faIcon}
                    expanded={this.state.expanded}
                  />
                );
              })}
            <div className="button-terminate" />
          </ul>
        </nav>
      </div>
    );
  },
});

export default LeftNavigation;
