import React from 'react'
import FormInput from './FormInput'
import addConfirmModal from './addConfirmModal'
import { Col, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import shortid from 'shortid'
import api from './api'

const { shape, string, arrayOf, func, object } = React.PropTypes

const Edit = React.createClass({
  propTypes: {
    formStructure: arrayOf(shape({
      label: string,
      key: string,
      type: string,
      placeholder: string,
      description: string,
      transformValue: func
    })),
    data: object,
    _reset: object,
    setAdminModal: func,
    openConfirmModal: func,
    resetTable: func,
    flashMessage: func
  },
  getInitialState () {
    return ({
      shortId: '',
      method: 'put',
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
  updateFormData (state) {
    let newState = this.state
    Object.assign(newState.form.data, state)
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
      index > -1 && (this.setState(newState))
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
  checkValidation () {
    return !this.state.form.validationError || this.state.form.validationError.length === 0
  },
  sendData () {
    return new Promise((resolve, reject) => {
      let data = {}
      this.props.formStructure.map(entry => {
        if (entry.type === 'keyvalue') {
          data[entry.key] = this.state.form.data[entry.key].map(keyvalue => {
            let { key, value } = keyvalue
            return { key, value }
          })
        } else {
          if (entry.transformValue && entry.transformValue instanceof Function) {
            data[entry.key] = entry.transformValue(this.state.form.data[entry.key])
          } else {
            data[entry.key] = this.state.form.data[entry.key]
          }
        }
      })
      let { method, shortId } = this.state
      let url = `/models/all/${shortId}`
      console.log({ method, shortId, url, data })
      api._send(
        this.state.method,
        url,
        data
      ).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  componentWillMount () {
    let { data } = this.props
    let title = 'Edit'
    let method = 'put'
    let shortId = this.props.data._shortId
    if (Object.keys(data).length === 0 && data.constructor === Object) {
      title = 'New'
      method = 'post'
      shortId = ''
      this.props.formStructure.map(entry => {
        if (entry.type === 'keyvalue') {
          data[entry.key] = []
        } else {
          data[entry.key] = ''
        }
      })
    }
    this.setState({ title, method, shortId, form: { data } })
  },
  render () {
    const formStructure = this.props.formStructure || []
    let buttonEffects = {
      cancel: {
        onClick: (event) => {
          event.preventDefault()
          this.props.openConfirmModal({
            modalType: 'warning',
            header: 'Cancel',
            body: 'If you leave this page, you will lose any unsaved changes',
            onConfirm: () => this.props.setAdminModal(false)
          })
        }
      },
      save: {
        onClick: (event) => {
          event.preventDefault()
          if (this.checkValidation()) {
            this.props.openConfirmModal({
              modalType: 'info',
              header: 'Save',
              body: 'Are you sure you want to save your changes?',
              onConfirm: () => {
                this.sendData()
                .then(this.props.resetTable)
                .then(() => {
                  this.props.flashMessage(
                    'success',
                    <span>Successfully updated <strong>{this.state.form.data.name}</strong>.</span>
                  )
                })
                this.props.setAdminModal(false)
              }
            })
          } else {
            this.props.openConfirmModal({
              modalType: 'danger',
              header: 'Oops',
              body: 'Make sure that you have the from filled out completely.',
              noCancel: true
            })
          }
        }
      }
    }
    return (
      <div className='admin-edit-modal'>
        <Col md={8} className='col-md-offset-2'>
          <h1>{this.state.title}<small title='shortId'>{this.props.data._shortId}</small></h1>
          <form>
            {formStructure.map((input) => {
              if (input.type) {
                return (
                  <FormInput
                    key={`input_${input.key}`}
                    value={this.state.form.data[input.key]}
                    structure={input}
                    updateFormData={this.updateFormData}
                    removeKeyValueEntry={this.removeKeyValueEntry}
                    pushNewKeyValueEntry={this.pushNewKeyValueEntry}
                    handleChange={this.handleChange}
                    handleKeyValueChange={this.handleKeyValueChange}
                    addValidationError={this.addValidationError}
                    removeValidationError={this.removeValidationError}
                  />
                )
              }
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
