import React from 'react'
import { Col, FormGroup, FormControl, ControlLabel, InputGroup, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { findDOMNode } from 'react-dom'

const { shape, string, arrayOf, func, oneOfType, array, object, bool, number } = React.PropTypes

const Edit = React.createClass({
  propTypes: {
    formStructure: arrayOf(shape({
      label: string,
      key: string,
      type: string,
      placeholder: string,
      description: string
    })),
    data: object,
    setAdminModal: func
  },
  getInitialState () {
    return ({
      form: {
        data: this.props.data || []
      }
    })
  },
  handleChange (event, key) {
    let newState = this.state
    Object.assign(newState.form.data, {[key]: event.target.value})
    this.setState(newState)
  },
  pushNewKeyValueEntry (key, component) {
    const data = component.state
    let newState = this.state
    newState.form.data[key].push({key: data.key, value: data.value})
    this.setState(newState)
  },
  removeKeyValueEntry (key, component) {
    let newState = this.state
    let index = newState.form.data[key].findIndex(i => i._shortId === component.props.shortId)
    if (index > -1) {
      newState.form.data[key].splice(index, 1)
      index > -1 ? this.setState(newState) : undefined
    }
  },
  handleKeyValueChange (event, key, keyName, index) {
    let newState = this.state
    Object.assign(newState.form.data[key][index], {[keyName]: event.target.value})
    this.setState(newState)
  },
  render () {
    const formStructure = this.props.formStructure || []
    let cancelEffect = {
      onClick: (event) => {
        event.preventDefault()
        this.props.setAdminModal(false)
      }
    }
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
                  removeKeyValueEntry={this.removeKeyValueEntry}
                  pushNewKeyValueEntry={this.pushNewKeyValueEntry}
                  handleChange={this.handleChange}
                  handleKeyValueChange={this.handleKeyValueChange}
                />
              )
            })}
            <div className='form-buttons'>
              <Button bsStyle='danger' {...cancelEffect}>
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
    index: number,
    shortId: string,
    structure: shape({
      label: string,
      key: string,
      type: string,
      placeholder: string,
      description: string
    }),
    handleKeyValueChange: func,
    buttonEffect: func
  },
  getInitialState () {
    return ({
      key: '',
      value: '',
      index: '',
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
      this.props.index >= 0 ? newState.index = this.props.index : undefined
    }
    this.setState(newState)
  },
  render () {
    const buttonEffect = {
      onClick: (event) => {
        event.preventDefault()
        if (this.props.buttonEffect) {
          this.props.buttonEffect(this.props.structure.key, this)
        }
      }
    }
    let buttonStyle = {
      bsStyle: 'danger',
      faIcon: 'trash'
    }
    if (this.state.newEntry) {
      buttonStyle = {
        bsStyle: 'success',
        faIcon: 'plus'
      }
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
            <Button
              bsStyle={buttonStyle.bsStyle}
              className='button-round-right'
              {...buttonEffect}>
              <FontAwesome className='fa-fw' name={buttonStyle.faIcon} />
            </Button>
          </InputGroup.Button>
        </InputGroup>
      </div>
    )
  }
})

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

export default Edit
