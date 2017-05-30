import React from 'react'
import FontAwesome from 'react-fontawesome'
import { VelocityComponent } from 'velocity-react'

const { string } = React.PropTypes

const MenuButton = React.createClass({
  propTypes: {
    faIcon: string,
    label: string,
    color: string,
    linkTo: string,
    bgColor: string
  },
  getInitialState () {
    return ({
      hovering: false
    })
  },
  render () {
    const { faIcon, label, linkTo, bgColor } = this.props
    const hoverEffect = {
      onMouseEnter: () => { this.setState({hovering: true}) },
      onMouseLeave: () => { this.setState({hovering: false}) }
    }
    let animationProps
    if (this.state.hovering) {
      animationProps = {
        animation: {
          right: [-150, 'spring']
        },
        duration: 400
      }
    } else {
      animationProps = {
        animation: {
          right: [0, 'spring']
        },
        duration: 400
      }
    }
    return (
      <li style={{backgroundColor: bgColor}} className='button' {...hoverEffect}>
        <a href={linkTo} title={label}>
          <FontAwesome className='fa-fw nav-button' name={faIcon} />
          <VelocityComponent {...animationProps} >
            <div className='button-label'>
              <span>{label}</span>
            </div>
          </VelocityComponent>
        </a>
      </li>
    )
  }
})

export default MenuButton
