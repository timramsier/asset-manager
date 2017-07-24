import React from 'react'
import HelperText from './HelperText'
import KeyValuePair from './KeyValuePair'
import { Col, FormGroup, FormControl, ControlLabel, InputGroup } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
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
  componentDidMount () {
    this.setState = {thisElement: findDOMNode(this)}
  },
  render () {
    let { structure } = this.props
    let inputType
    switch (structure.type) {
      case 'text':
        inputType = (
          <InputGroup>
            <FormControl
              type='text'
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
        break
      case 'textarea':
        inputType = (
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
        break
      case 'keyvalue':
        // let i = 0
        inputType = (
          <div className='multi-keyvalue-box'>
            {this.props.value.map((entry) => {
              return (
                <KeyValuePair
                  buttonEffect={this.props.removeKeyValueEntry}
                  structure={structure}
                  key={entry._shortId}
                  data={entry}
                  shortId={entry._shortId}
                />
              )
            })}
            <KeyValuePair
              newEntry
              buttonEffect={this.props.pushNewKeyValueEntry}
              structure={structure}
            />
          </div>
        )
        break
    }

    return (
      <Col md={structure.colspan || 12}>
        <FormGroup className='form-item'>
          <ControlLabel>
            {structure.label}
          </ControlLabel>
          {inputType}
        </FormGroup>
      </Col>
    )
  }
})

export default FormInput
