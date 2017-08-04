import React from 'react'
import { FormControl } from 'react-bootstrap'

const { shape, string, func, oneOfType, array } = React.PropTypes

const InputText = React.createClass({
  propTypes: {
    handleChange: func,
    setValidationState: func,
    addValidationError: func,
    removeValidationError: func,
    structure: shape({
      label: string,
      key: string,
      type: string,
      placeholder: string,
      description: string
    }),
    value: oneOfType([string, array])
  },
  updateValidationError () {
    const { structure, value } = this.props
    let valid
    let inputName = `input_${structure.type}_${structure.key}`
    if (value.length < 3) {
      valid = 'error'
      this.props.addValidationError(inputName)
    } else {
      valid = null
      this.props.removeValidationError(inputName)
    }
    return valid
  },
  componentDidMount () {
    this.updateValidationError()
  },
  render () {
    const { structure } = this.props
    const inputBehavior = {
      onChange: (event) => this.props.handleChange(event, structure.key),
      onBlur: () => {
        this.props.setValidationState(this.updateValidationError())
      }
    }
    return (
      <FormControl
        type='text'
        // placeholder={this.props.structure.placeholder}
        value={this.props.value}
        {...inputBehavior}
      />
    )
  }
})

export default InputText
