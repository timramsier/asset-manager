import React from 'react'
import { FormControl } from 'react-bootstrap'

const { shape, string, func, oneOfType, bool, array } = React.PropTypes

const InputSelect = React.createClass({
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
      description: string,
      options: array
    }),
    value: oneOfType([string, bool])
  },
  updateValidationError () {
    const { structure, value } = this.props
    let valid
    let inputName = `input_${structure.type}_${structure.key}`
    if (value === 'null' || value === '') {
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
    const inputBehavior = {
      onChange: (event) => this.props.handleChange(event, this.props.structure.key),
      onBlur: () => {
        this.props.setValidationState(this.updateValidationError())
      }
    }
    return (
      <FormControl
        componentClass='select'
        placeholder='select'
        defaultValue={this.props.value}
        {...inputBehavior}
      >
        <option key={`key_null`} value='null'>
          --- Select One ---
        </option>
        {this.props.structure.options.map((option) => {
          return (
            <option key={`key_${option}`} value={option}>
              {`${option}`.charAt(0).toUpperCase() + `${option}`.slice(1)}
            </option>
          )
        })}
      </FormControl>
    )
  }
})

export default InputSelect
