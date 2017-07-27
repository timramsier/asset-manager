import React from 'react'
import { FormControl } from 'react-bootstrap'

const { shape, string, func, oneOfType, array } = React.PropTypes

const InputTextArea = React.createClass({
  propTypes: {
    handleChange: func,
    structure: shape({
      label: string,
      key: string,
      type: string,
      placeholder: string,
      description: string
    }),
    value: oneOfType([string, array])
  },
  render () {
    return (
      <FormControl
        style={{height: '100px', resize: 'vertical'}}
        componentClass='textarea'
        // placeholder={this.props.structure.placeholder}
        value={this.props.value}
        onChange={(event) => this.props.handleChange(event, this.props.structure.key)}
      />
    )
  }
})

export default InputTextArea
