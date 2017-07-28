import React from 'react'
import { FormControl } from 'react-bootstrap'

const { shape, string, func, oneOfType, bool, array } = React.PropTypes

const InputSelect = React.createClass({
  propTypes: {
    handleChange: func,
    setValidationState: func,
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
  render () {
    const inputBehavior = {
      onChange: (event) => this.props.handleChange(event, this.props.structure.key),
      onBlur: () => {
        let valid
        this.props.value === null ? valid = 'error' : valid = null
        this.props.setValidationState(valid)
      }
    }
    return (
      <FormControl
        componentClass='select'
        placeholder='select'
        defaultValue={this.props.value}
        {...inputBehavior}
      >
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
