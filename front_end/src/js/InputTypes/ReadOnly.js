import React from 'react'
import { FormControl } from 'react-bootstrap'

const { string } = React.PropTypes

const ReadOnly = React.createClass({
  propTypes: {
    value: string
  },
  render () {
    return (
      <FormControl.Static>
        {this.props.value}
      </FormControl.Static>
    )
  }
})

export default ReadOnly
