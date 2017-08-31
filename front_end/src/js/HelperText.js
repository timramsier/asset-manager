import React from 'react'
import { findDOMNode } from 'react-dom'
const { string } = React.PropTypes

const HelperText = React.createClass({
  propTypes: {
    children: string
  },
  getInitialState () {
    return ({
      parentHover: false
    })
  },
  componentDidMount () {
    const parent = findDOMNode(this).parentNode
    parent.addEventListener('mouseover', (event) => {
      this.setState({parentHover: true})
    })
    parent.addEventListener('mouseout', (event) => {
      this.setState({parentHover: false})
    })
    this._height = findDOMNode(this).clientHeight
  },
  render () {
    let style
    if (this.state.parentHover) {
      style = {opacity: 1.0, zIndex: 1000, top: `-${this._height / 2 - 5}px`}
    } else {
      style = {opacity: 0.0, zIndex: -1}
    }
    return (
      <div className='helper-text' style={style}>
        <p>{this.props.children}</p>
      </div>
    )
  }
})

export default HelperText
