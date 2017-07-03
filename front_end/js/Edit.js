import React from 'react'
import { Col, FormGroup, FormControl, ControlLabel, InputGroup } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { findDOMNode } from 'react-dom'

const { shape, string, arrayOf, func } = React.PropTypes
const Edit = React.createClass({
  propTypes: {
    formStructure: arrayOf(shape({
      label: string,
      key: string,
      type: string,
      placeholder: string,
      description: string
    })),
    data: shape({
      name: string,
      vendor: string
    })
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
  render () {
    const formStructure = this.props.formStructure || []
    return (
      <div className='admin-edit-modal'>
        <Col md={6} className='col-md-offset-3'>
          <h1>Edit <small title='shortId'>{this.props.data._shortId}</small></h1>
          <form>
            {formStructure.map((input) => {
              return (
                <FormInput
                  key={`input_${input.key}`}
                  value={this.state.form.data[input.key]}
                  structure={input}
                  handleChange={this.handleChange}
                />
              )
            })}
          </form>
        </Col>
      </div>
    )
  }
})

// Input types

const _structureProps = {
  handleChange: func,
  structure: shape({
    label: string,
    key: string,
    type: string,
    placeholder: string,
    description: string
  }),
  value: string
}

const HelperText = React.createClass({
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
      style = {opacity: 1.0, zIndex: 1}
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

const FormInput = React.createClass({
  propTypes: _structureProps,
  render () {
    let { structure } = this.props
    let inputType
    switch (structure.type) {
      case 'text':
        inputType = (
          <FormControl
            type='text'
            placeholder={this.props.structure.placeholder}
            value={this.props.value}
            onChange={(event) => this.props.handleChange(event, this.props.structure.key)}
          />
        )
        break
      case 'textarea':
        inputType = (
          <FormControl
            componentClass='textarea'
            placeholder={this.props.structure.placeholder}
            value={this.props.value}
            onChange={(event) => this.props.handleChange(event, this.props.structure.key)}
          />
        )
        break
      default:
        inputType = (
          <FormControl
            type={this.props.structure.type}
            placeholder={this.props.structure.placeholder}
            value={this.props.value}
            onChange={(event) => this.props.handleChange(event, this.props.structure.key)}
          />
        )
    }

    return (
      <FormGroup className='form-item'>
        <ControlLabel>
          {this.props.structure.label}
        </ControlLabel>
        <InputGroup>
          {inputType}
          <InputGroup.Addon>
            <FontAwesome className='fa-fw' name='info-circle' />
            <HelperText>{this.props.structure.description}</HelperText>
          </InputGroup.Addon>
        </InputGroup>
      </FormGroup>
    )
  }
})

export default Edit
