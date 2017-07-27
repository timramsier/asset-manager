import React from 'react'
import FontAwesome from 'react-fontawesome'
import InputType from './InputTypes/InputType'
import HelperText from './HelperText'
import { Col, FormGroup, ControlLabel } from 'react-bootstrap'
import { findDOMNode } from 'react-dom'

const { shape, string, func, oneOfType, array, bool } = React.PropTypes

const FormInput = React.createClass({
  propTypes: {
    handleChange: func,
    pushNewKeyValueEntry: func,
    removeKeyValueEntry: func,
    structure: shape({
      label: string,
      key: string,
      type: string,
      placeholder: string,
      description: string,
      options: array
    }),
    value: oneOfType([string, array, bool]),
    handleKeyValueChange: func
  },
  getInitialState () {
    return ({
      thisElement: null
    })
  },
  componentDidMount () {
    let newState = this.state
    Object.assign({thisElement: findDOMNode(this)})
    this.setState(newState)
  },
  render () {
    let { structure } = this.props
    let Input
    switch (structure.type) {
      case 'text':
        Input = InputType.Text
        break
      case 'textarea':
        Input = InputType.TextArea
        break
      case 'keyvalue':
        // let i = 0
        Input = InputType.KeyValueGroup
        break
      case 'select':
        // let i = 0
        Input = InputType.Select
        break
      default:
        Input = () => <span />
    }

    return (
      <Col md={structure.colspan || 12}>
        <FormGroup className='form-item'>
          <ControlLabel>
            {structure.label}
            <span className='helper'>
              <FontAwesome className='fa-fw' name='info-circle' />
              <HelperText>{this.props.structure.description}</HelperText>
            </span>
          </ControlLabel>
          <Input {...this.props} />
        </FormGroup>
      </Col>
    )
  }
})

export default FormInput
