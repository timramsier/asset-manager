import React from 'react'
import { FormControl } from 'react-bootstrap'

const { shape, string, func, oneOfType, array } = React.PropTypes

const InputText = React.createClass({
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
        type='text'
        // placeholder={this.props.structure.placeholder}
        value={this.props.value}
        onChange={(event) => this.props.handleChange(event, this.props.structure.key)}
      />
    )
  }
})

export default InputText
