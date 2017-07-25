import React from 'react'
import InputKeyValueGroup from './InputKeyValueGroup'
import InputText from './InputText'
import InputTextArea from './InputTextArea'
import { Col, FormGroup, ControlLabel } from 'react-bootstrap'
import { findDOMNode } from 'react-dom'

const { shape, string, func, oneOfType, array } = React.PropTypes

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
      description: string
    }),
    value: oneOfType([string, array]),
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
    let InputType
    switch (structure.type) {
      case 'text':
        InputType = InputText
        break
      case 'textarea':
        InputType = InputTextArea
        break
      case 'keyvalue':
        // let i = 0
        InputType = InputKeyValueGroup
        break
      default:
        InputType = () => <span />
    }

    return (
      <Col md={structure.colspan || 12}>
        <FormGroup className='form-item'>
          <ControlLabel>
            {structure.label}
          </ControlLabel>
          <InputType {...this.props} />
        </FormGroup>
      </Col>
    )
  }
})

export default FormInput
