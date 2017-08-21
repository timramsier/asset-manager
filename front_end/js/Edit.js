/* globals FormData */
import React from 'react'
import FormInput from './FormInput'
import addConfirmModal from './addConfirmModal'
import { Col, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import axios from 'axios'
import { guid } from './common'
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
        canSave: false,
        changeArray: []
      }
    })
  },
  handleChange (event, key) {
    let newState = this.state
    Object.assign(newState.form.data, {[key]: event.target.value})
    this.setState(newState)
    this.checkForDiff(key)
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
      this.checkForDiff({ key, index }, shortId)
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
  checkIfDiff () {
    return !(!this.state.form.changeArray || this.state.form.changeArray.length === 0)
  },
  setSaveState (value) {
    let newState = this.state
    Object.assign(newState.form, {canSave: value})
    this.setState(newState)
  },
  updateSaveState () {
    let newState = this.state
    if (this.checkIfDiff() && this.checkValidation()) {
      Object.assign(newState.form, {canSave: true})
    } else {
      Object.assign(newState.form, {canSave: true})
    }
    this.setState(newState)
  },
  checkForDiff (target, hash = '0') {
    let ref
    let diff
    let inputName
    if (target instanceof Object) {
      let { key, index } = target
      inputName = `input_${key}_${hash}`
      if (typeof this.state.form.data[key][index] === 'boolean') {
        ref = `${this.state.form.data[key][index]}`
      } else {
        ref = this.state.form.data[key][index]
      }
      if (typeof this.props._reset[key][index] === 'boolean') {
        diff = `${this.props._reset[key][index]}`
      } else {
        diff = this.props._reset[key][index]
      }
      if (ref.key !== diff.key || ref.value !== diff.value) {
        this.addFormArray(inputName, 'changeArray')
      } else {
        this.removeFormArray(inputName, 'changeArray')
      }
    } else {
      inputName = `input_${target}_${hash}`
      if (typeof this.state.form.data[target] === 'boolean') {
        ref = `${this.state.form.data[target]}`
      } else {
        ref = this.state.form.data[target]
      }
      if (typeof this.props._reset[target] === 'boolean') {
        diff = `${this.props._reset[target]}`
      } else {
        diff = this.props._reset[target]
      }
      if (ref !== diff) {
        this.addFormArray(inputName, 'changeArray')
      } else {
        this.removeFormArray(inputName, 'changeArray')
      }
    }
    this.updateSaveState()
  },
  addFormArray (inputName, arrayName) {
    let newState = this.state
    if (!this.state.form[arrayName] || this.state.form[arrayName].indexOf(inputName) < 0) {
      let array = newState.form[arrayName] || []
      array.push(inputName)
      Object.assign(newState.form, { [arrayName]: array })
      this.setState(newState)
    }
  },
  removeFormArray (inputName, arrayName) {
    let newState = this.state
    if (this.state.form[arrayName]) {
      let array = newState.form[arrayName] || []
      let index = array.indexOf(inputName)
      if (index >= 0) {
        array.splice(index, 1)
        Object.assign(newState.form, { [arrayName]: array })
        this.setState(newState)
      }
    }
  },
  sendData () {
    const updateData = () => new Promise((resolve, reject) => {
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
      let { shortId } = this.state
      let url = `/models/all/${shortId}`
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
    const removePreviousFile = (result) => new Promise((resolve, reject) => {
      var filename = result.image.split('\\').pop().split('/').pop()
      axios.delete('/image/delete', {
        data: {target: filename}
      })
        .then(res => { resolve(res) })
        .catch(err => { reject(err) })
    })
    const uploadFile = (result) => new Promise((resolve, reject) => {
      let fileInputs = document.querySelectorAll(`.admin-edit-modal input[type="file"]`)
      let fileData = new FormData()
      let updateCounter = 0
      for (let i = 0; i < fileInputs.length; i++) {
        let name = fileInputs[i].getAttribute('name')
        if (fileInputs[i].files[0]) {
          let file = fileInputs[i].files[0]
          let fileName = file.name
          if (name === 'image') {
            if (this.props.data._id && this.props.data._id !== '') {
              fileName = `${this.props.data._id}.${fileName.split('.').pop()}`
            } else {
              fileName = `${this.state.tempId}.${fileName.split('.').pop()}`
            }
          }
          fileData.append(`fileName-${name}`, fileName)
          fileData.append(name, file)
          updateCounter++
        }
      }
      if (updateCounter > 0) {
        axios.put('/image/upload', fileData)
          .then(res => { resolve(res) })
          .catch(err => { reject(err) })
      }
    })

    return updateData()
      .then(removePreviousFile)
      .then(uploadFile)
  },
  componentWillMount () {
    let { data } = this.props
    let title = 'Edit'
    let method = 'put'
    let shortId = this.props.data._shortId
    let tempId
    if (Object.keys(data).length === 0 && data.constructor === Object) {
      title = 'New'
      method = 'post'
      shortId = ''
      tempId = `temp_${guid()}`
      this.props.formStructure.map(entry => {
        if (entry.type === 'keyvalue') {
          data[entry.key] = []
        } else {
          data[entry.key] = ''
        }
      })
    }
    this.setState({ title, tempId, method, shortId, form: { data } })
  },
  render () {
    const formStructure = this.props.formStructure || []
    let buttonEffects = {
      cancel: {
        onClick: (event) => {
          event.preventDefault()
          if (this.checkIfDiff()) {
            this.props.openConfirmModal({
              modalType: 'warning',
              header: 'Cancel',
              body: 'If you leave this page, you will lose any unsaved changes',
              onConfirm: () => this.props.setAdminModal(false)
            })
          } else {
            this.props.setAdminModal(false)
          }
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
                    tempId={this.state.tempId}
                    key={`input_${input.key}`}
                    formData={this.state.form.data}
                    value={this.state.form.data[input.key]}
                    structure={input}
                    addFormArray={this.addFormArray}
                    removeFormArray={this.removeFormArray}
                    updateFormData={this.updateFormData}
                    removeKeyValueEntry={this.removeKeyValueEntry}
                    pushNewKeyValueEntry={this.pushNewKeyValueEntry}
                    handleChange={this.handleChange}
                    handleKeyValueChange={this.handleKeyValueChange}
                    addValidationError={this.addValidationError}
                    removeValidationError={this.removeValidationError}
                    checkForDiff={this.checkForDiff}
                    setSaveState={this.setSaveState}
                  />
                )
              }
            })}
            <div className='form-buttons'>
              <Button bsStyle='danger' {...buttonEffects.cancel}>
                <FontAwesome className='fa-fw' name='times' />Cancel
              </Button>
              <Button bsStyle='success'
                disabled={!this.state.form.canSave}
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
