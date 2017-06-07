import React from 'react'
import { VelocityComponent } from 'velocity-react'

const { func, bool } = React.PropTypes

const ExpandButton = React.createClass({
  propTypes: {
    toggleMenu: func,
    expanded: bool
  },
  getInitialState () {
    return ({
      hovering: false
    })
  },
  render () {
    const buttonEffect = {
      onMouseEnter: () => { this.setState({hovering: true}) },
      onMouseLeave: () => { this.setState({hovering: false}) },
      onClick: (event) => {
        event.preventDefault()
        this.props.toggleMenu()
      }
    }
    let rotateProps
    if (!this.props.expanded) {
      rotateProps = {
        top: '45deg',
        bottom: '-45deg'
      }
    } else {
      rotateProps = {
        top: '-45deg',
        bottom: '45deg'
      }
    }
    let topAnimationProps
    let bottomAnimationProps
    if (this.state.hovering) {
      topAnimationProps = {
        animation: {
          rotateZ: rotateProps.top,
          backgroundColor: '#f2f2f2'
        },
        duration: 400
      }
      bottomAnimationProps = {
        animation: {
          rotateZ: rotateProps.bottom,
          backgroundColor: '#f2f2f2'
        },
        duration: 400
      }
    } else {
      topAnimationProps = {
        animation: {
          rotateZ: '0deg',
          backgroundColor: '#666'
        },
        duration: 400
      }
      bottomAnimationProps = {
        animation: {
          rotateZ: '0deg',
          backgroundColor: '#666'
        },
        duration: 400
      }
    }
    return (
      <a href='#'>
        <span className='menu-toggle' {...buttonEffect} >
          <VelocityComponent {...topAnimationProps}>
            <span className='line upper-line' />
          </VelocityComponent>
          <VelocityComponent {...bottomAnimationProps}>
            <span className='line lower-line' />
          </VelocityComponent>
        </span>
      </a>
    )
  }
})

export default ExpandButton
