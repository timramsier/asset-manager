import React from 'react'
import FontAwesome from 'react-fontawesome'
import { Link } from 'react-router'
import { VelocityComponent } from 'velocity-react'

const { string, bool } = React.PropTypes

const MenuButton = React.createClass({
  propTypes: {
    name: string,
    faIcon: string,
    label: string,
    color: string,
    linkTo: string,
    bgColor: string,
    expanded: bool
  },
  getInitialState () {
    return ({
      hovering: false
    })
  },
  render () {
    const { faIcon, label, linkTo, bgColor, name } = this.props
    const hoverEffect = {
      onMouseEnter: () => { this.setState({hovering: true}) },
      onMouseLeave: () => { this.setState({hovering: false}) }
    }

    let animationProps
    let labelAnimationProps
    let expandClass

    if (!this.props.expanded) {
      if (this.state.hovering) {
        animationProps = {
          animation: {
            right: [-150, 'spring']
          },
          duration: 400
        }
        labelAnimationProps = {
          animation: {
            opacity: 1.0
          },
          duration: 0
        }
      } else {
        animationProps = {
          animation: {
            right: [0, 'spring']
          },
          duration: 200
        }
        labelAnimationProps = {
          animation: {
            opacity: 0.0
          },
          duration: 200
        }
      }
    } else {
      expandClass = 'button-expanded'
      labelAnimationProps = {
        animation: {
          opacity: 1.0
        },
        duration: 200
      }
    }
    return (
      <li style={{backgroundColor: bgColor}} className={`button ${expandClass}`} {...hoverEffect}>
        <Link to={linkTo} title={label}>
          <FontAwesome className='fa-fw nav-button' name={faIcon} />
          <VelocityComponent {...animationProps} >
            <div className='button-label'>
              <VelocityComponent {...labelAnimationProps}>
                <span>{name}</span>
              </VelocityComponent>
            </div>
          </VelocityComponent>
        </Link>
      </li>
    )
  }
})

export default MenuButton
