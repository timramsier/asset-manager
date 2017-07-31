import React from 'react'
import FormInput from './FormInput'
import addConfirmModal from './addConfirmModal'
import { Col, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import shortid from 'shortid'
import axios from 'axios'
import apiSettings from '../config/apiSettings'

const { shape, string, arrayOf, func, object } = React.PropTypes

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
    _reset: object,
    setAdminModal: func,
    openConfirmModal: func
  },
  getInitialState () {
    return ({
      form: {
        data: {},
        validationError: [],
        canSave: true
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
    newState.form.data[key].push({
      _shortId: `temp_${shortid()}`,
      key: data.key,
      value: data.value
    })
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
  handleKeyValueChange (event, key, keyName, shortId) {
    let newState = this.state
    let index = newState.form.data[key].findIndex(i => i._shortId === shortId)
    if (index > -1) {
      Object.assign(newState.form.data[key][index], {[keyName]: event.target.value})
      this.setState(newState)
    }
  },
  addValidationError (inputName) {
    let newState = this.state
    if (!this.state.form.validationError || this.state.form.validationError.indexOf(inputName) < 0) {
      let validationError = newState.form.validationError || []
      validationError.push(inputName)
      Object.assign(newState.form, { validationError })
      this.setState(newState)
    }
  },
  removeValidationError (inputName) {
    let newState = this.state
    if (this.state.form.validationError) {
      let validationError = newState.form.validationError || []
      let index = validationError.indexOf(inputName)
      if (index >= 0) {
        validationError.splice(index, 1)
        Object.assign(newState.form, { validationError })
        this.setState(newState)
      }
    }
  },
  postData () {
    let postObj = {}
    this.props.formStructure.map(entry => {
      if (entry.type === 'keyvalue') {
        postObj[entry.key] = this.state.form.data[entry.key].map(keyvalue => {
          let { key, value } = keyvalue
          return { key, value }
        })
      } else {
        postObj[entry.key] = this.state.form.data[entry.key]
      }
    })
    let url = `http://${apiSettings.uri}/models/all/${this.props.data._shortId}`
    axios({
      url,
      method: 'put',
      auth: apiSettings.auth,
      data: postObj
    }).then((response) => {
      console.log(response)
    })
  },
  componentWillMount () {
    this.setState({form: { data: this.props.data }})
  },
  render () {
    const formStructure = this.props.formStructure || []
    let buttonEffects = {
      cancel: {
        onClick: (event) => {
          event.preventDefault()
          this.props.openConfirmModal({
            header: 'Cancel and Leave',
            body: 'If you leave this page, you will lose any unsaved changes',
            onConfirm: () => this.props.setAdminModal(false)
          })
        }
      },
      save: {
        onClick: (event) => {
          event.preventDefault()
          this.props.openConfirmModal({
            header: 'Save Changes',
            body: 'Are you sure you want to save your changes?',
            onConfirm: this.postData
          })
        }
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
                  addValidationError={this.addValidationError}
                  removeValidationError={this.removeValidationError}
                />
              )
            })}
            <div className='form-buttons'>
              <Button bsStyle='danger' {...buttonEffects.cancel}>
                <FontAwesome className='fa-fw' name='times' />Cancel
              </Button>
              <Button bsStyle='success'
                disabled={this.state.form.canSave}
                {...buttonEffects.save}
              >
                <FontAwesome className='fa-fw' name='check' />Save
              </Button>
            </div>
          </form>
        </Col>
      </div>
    )
  }
})

export default addConfirmModal(Edit)
