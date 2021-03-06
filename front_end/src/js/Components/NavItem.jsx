import React from 'react';
import { VelocityComponent } from 'velocity-react';

const { string, func, bool } = React.PropTypes;

const NavItem = React.createClass({
  propTypes: {
    label: string,
    setView: func,
    active: bool,
    highlightColor: string,
  },
  getInitialState() {
    return {
      hovering: false,
    };
  },
  render() {
    const { label } = this.props;
    const hoverEffect = {
      onMouseEnter: () => {
        this.setState({ hovering: true });
      },
      onMouseLeave: () => {
        this.setState({ hovering: false });
      },
    };
    let animationProps;
    let activeClass;
    if (!this.props.active) {
      if (this.state.hovering && !this.props.active) {
        animationProps = {
          animation: {
            width: '100%',
          },
          duration: 200,
        };
      } else {
        animationProps = {
          animation: {
            width: '0%',
          },
          duration: 200,
        };
      }
      activeClass = '';
    } else {
      activeClass = 'nav-active';
    }
    return (
      <li className="button" {...hoverEffect}>
        <a
          role="button"
          title={label}
          className={activeClass}
          tabIndex={0}
          onClick={() => {
            this.props.setView(label.toLowerCase());
          }}
        >
          <span className="nav-label">{label}</span>
          <VelocityComponent {...animationProps}>
            <span
              className="nav-highlight"
              style={{ background: this.props.highlightColor }}
            />
          </VelocityComponent>
        </a>
      </li>
    );
  },
});

export default NavItem;
