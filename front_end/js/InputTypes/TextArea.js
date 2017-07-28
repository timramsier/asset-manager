import React from 'react'
import { FormControl } from 'react-bootstrap'

const { shape, string, func, oneOfType, array } = React.PropTypes

const InputTextArea = React.createClass({
  propTypes: {
    handleChange: func,
    setValidationState: func,
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
    const inputBehavior = {
      onChange: (event) => this.props.handleChange(event, this.props.structure.key),
      onBlur: () => {
        let valid
        this.props.value.length < 3 ? valid = 'error' : valid = null
        this.props.setValidationState(valid)
      }
    }
    return (
      <FormControl
        style={{height: '100px', resize: 'vertical'}}
        componentClass='textarea'
        // placeholder={this.props.structure.placeholder}
        {...inputBehavior}
        value={this.props.value}
      />
    )
  }
})

export default InputTextArea
