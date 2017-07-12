import React from 'react'
import { Col, FormGroup, FormControl, ControlLabel, InputGroup, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { findDOMNode } from 'react-dom'

const { shape, string, arrayOf, func, oneOfType, array, object, bool } = React.PropTypes

const Edit = React.createClass({
  propTypes: {
    formStructure: arrayOf(shape({
      label: string,
      key: string,
      type: string,
      placeholder: string,
      description: string
    })),
    data: object
  },
  getInitialState () {
    return ({
      form: {
        data: this.props.data
      }
    })
  },
  handleChange (event, key) {
    let newState = this.state
    Object.assign(newState.form.data, {[key]: event.target.value})
    this.setState(newState)
  },
  pushNewEntry (event, key) {

  },
  handleKeyValueChange (event, key, keyName, index) {
    let newState = this.state
    Object.assign(newState.form.data[key][index], {[keyName]: event.target.value})
    this.setState(newState)
  },
  render () {
    const formStructure = this.props.formStructure || []
    return (
      <div className='admin-edit-modal'>
        <Col md={8} className='col-md-offset-2'>
          <h1>Edit <small title='shortId'>{this.props.data._shortId}</small></h1>
          <form>
            {formStructure.map((input) => {
              return (
                <FormInput
                  key={`input_${input.key}`}
                  value={this.state.form.data[input.key]}
                  structure={input}
                  pushNewEntry={this.pushNewEntry}
                  handleChange={this.handleChange}
                  handleKeyValueChange={this.handleKeyValueChange}
                />
              )
            })}
            <div className='form-buttons'>
              <Button bsStyle='danger'>
                <FontAwesome className='fa-fw' name='times' />Cancel
              </Button>
              <Button bsStyle='success'>
                <FontAwesome className='fa-fw' name='check' />Save
              </Button>
            </div>
          </form>
        </Col>
      </div>
    )
  }
})

// Input types
const HelperText = React.createClass({
  propTypes: {
    children: string
  },
  getInitialState () {
    return ({
      parentHover: false
    })
  },
  componentDidMount () {
    const parent = findDOMNode(this).parentNode
    parent.addEventListener('mouseover', (event) => {
      this.setState({parentHover: true})
    })
    parent.addEventListener('mouseout', (event) => {
      this.setState({parentHover: false})
    })
  },
  render () {
    let style
    if (this.state.parentHover) {
      style = {opacity: 1.0, zIndex: 1000}
    } else {
      style = {opacity: 0.0, zIndex: -1}
    }
    return (
      <div className='helper-text' style={style}>
        <p>{this.props.children}</p>
      </div>
    )
  }
})

const KeyValuePair = React.createClass({
  propTypes: {
    data: object,
    newEntry: bool,
    structure: shape({
      label: string,
      key: string,
      type: string,
      placeholder: string,
      description: string
    }),
    handleKeyValueChange: func
  },
  getInitialState () {
    return ({
      key: '',
      value: '',
      newEntry: this.props.newEntry || false
    })
  },
  handleChange (event, key) {
    let newState = this.state
    Object.assign(newState, {[key]: event.target.value})
    this.setState(newState)
  },
  componentWillMount () {
    let newState = this.state
    if (this.props.data) {
      this.props.data.key ? newState.key = this.props.data.key : undefined
      this.props.data.value ? newState.value = this.props.data.value : undefined
    }
    this.setState(newState)
  },
  render () {
    let buttonElement = (
      <Button bsStyle='danger' className='button-round-right'>
        <FontAwesome className='fa-fw' name='trash' />
      </Button>
    )
    if (this.state.newEntry) {
      buttonElement = (
        <Button bsStyle='success' className='button-round-right'>
          <FontAwesome className='fa-fw' name='plus' />
        </Button>
      )
    }
    return (
      <div className={`keyvalue-group new-entry-${this.state.newEntry}`}>
        <InputGroup>
          <InputGroup.Addon>
            Label:
          </InputGroup.Addon>
          <FormControl
            type='text'
            placeholder='Enter label'
            value={this.state.key}
            onChange={(event) => this.handleChange(event, 'key')}
          />
          <InputGroup.Addon>
            Value:
          </InputGroup.Addon>
          <FormControl
            type='text'
            placeholder='Enter value'
            value={this.state.value}
            onChange={(event) => this.handleChange(event, 'value')}
          />
          <InputGroup.Button>
            {buttonElement}
          </InputGroup.Button>
        </InputGroup>
      </div>
    )
  }
})

const FormInput = React.createClass({
  propTypes: {
    handleChange: func,
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
              style={{height: '100px'}}
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
        let i = 0
        inputType = (
          <div className='multi-keyvalue-box'>
            {this.props.value.map((entry) => {
              return (
                <KeyValuePair
                  structure={structure}
                  key={entry._shortId}
                  data={entry}
                  index={i++}
                />
              )
            })}
            <KeyValuePair
              newEntry
              structure={structure}
              index={i++}
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

export default Edit