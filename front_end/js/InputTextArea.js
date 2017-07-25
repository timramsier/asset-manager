import React from 'react'
import { FormControl, InputGroup } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import HelperText from './HelperText'

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
      <InputGroup>
        <FormControl
          style={{height: '100px', resize: 'vertical'}}
          componentClass='textarea'
          // placeholder={this.props.structure.placeholder}
          value={this.props.value}
          onChange={(event) => this.props.handleChange(event, this.props.structure.key)}
        />
        <div className='input-group-addon helper'>
          <FontAwesome className='fa-fw' name='info-circle' />
          <HelperText>{this.props.structure.description}</HelperText>
        </div>
      </InputGroup>
    )
  }
})

export default InputTextArea
