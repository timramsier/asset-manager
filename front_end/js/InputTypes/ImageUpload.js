/* global Image FileReader */
import React from 'react'
import { FormControl, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { findDOMNode } from 'react-dom'

const { shape, string, func, oneOfType, array, object } = React.PropTypes

const InputImage = React.createClass({
  propTypes: {
    handleChange: func,
    setValidationState: func,
    addValidationError: func,
    removeValidationError: func,
    addFormArray: func,
    removeFormArray: func,
    updateFormData: func,
    setSaveState: func,
    formData: object,
    tempId: string,
    structure: shape({
      label: string,
      key: string,
      type: string,
      placeholder: string,
      description: string
    }),
    value: oneOfType([string, array])
  },
  getInitialState () {
    return ({
      buttonText: 'Choose a File'
    })
  },
  updateValidationError () {
    const { structure, value } = this.props
    let valid
    let inputName = `input_${structure.type}_${structure.key}`
    if (value.length < 3) {
      valid = 'error'
      this.props.addValidationError(inputName)
    } else {
      valid = null
      this.props.removeValidationError(inputName)
    }
    return valid
  },
  handleFileUpload (event) {
    const file = event.target.files[0]
    const URL = window.URL || window.webkitURL
    const { formData, structure } = this.props
    const inputName = `image_${structure.key}_${formData._shortId}`
    if (file) {
      let image = new Image()
      let reader = new FileReader()
      let imgTag = document.getElementById(`preview-${this._idName}`)
      reader.onload = (event) => {
        imgTag.style.backgroundImage = `url(${event.target.result})`
      }
      image.onload = () => {
        this._element.classList.remove('invalid-file')
        this._element.classList.add('valid-file')
        this.props.addFormArray(inputName, 'changeArray')
        this.props.removeValidationError(inputName)
        this.setState({buttonText: file.name})
        let fileName = `${this.props.tempId}`
        formData._id && formData._id !== '' && (fileName = formData._id)
        const image = `${fileName}.${file.name.split('.').pop()}`
        this.props.updateFormData({ image: `/public/uploads/${image}` })
        this.props.setSaveState(true)
      }
      image.onerror = () => {
        this._element.value = ''
        this._element.classList.add('invalid-file')
        this._element.classList.remove('valid-file')
        imgTag.style.backgroundImage = `url(${this._originalImage})`
        this.props.removeFormArray(inputName, 'changeArray')
        this.props.addValidationError(inputName)
        this.setState({buttonText: 'Invalid File'})
      }
      reader.readAsDataURL(file)
      image.src = URL.createObjectURL(file)
    }
  },
  componentWillMount () {
    const { formData } = this.props
    this._idName = `image-upload-${formData._shortId}`
  },
  componentDidMount () {
    this.updateValidationError()
    const { formData } = this.props
    this._element = findDOMNode(this)
    this._originalImage = formData.image
    document.getElementById(`preview-${this._idName}`)
      .style.backgroundImage = `url(${formData.image})`
  },
  render () {
    const { structure, formData } = this.props
    const inputBehavior = {
      onChange: this.handleFileUpload,
      onBlur: () => {
        this.props.setValidationState(this.updateValidationError())
      }
    }
    const inputName = `image_${structure.key}_${formData._shortId}`
    const resetBehavior = {
      onClick: () => {
        this._element.classList.remove('invalid-file')
        this._element.classList.remove('valid-file')
        document.getElementById(this._idName).value = ''
        document.getElementById(`preview-${this._idName}`)
          .style.backgroundImage = `url(${this._originalImage})`
        this.props.removeValidationError(inputName)
        this.props.removeFormArray(inputName, 'changeArray')
        this.setState({buttonText: 'Choose a file'})
      }
    }
    return (
      <div className='image-upload'>
        <div
          className='preview-image'
          id={`preview-${this._idName}`}
        />
        <FormControl
          id={this._idName}
          type='file'
          name='image'
          label={structure.label}
          accept='image/*'
          className='input-file'
          {...inputBehavior}
        />
        <div className='image-controls'>
          <label
            className='image-button'
            title={this.state.buttonText}
            htmlFor={this._idName}><FontAwesome name='upload' /> {this.state.buttonText}</label>
          <Button
            className='image-reset'
            title='Reset Image'
            {...resetBehavior}><FontAwesome name='times' /></Button>
        </div>
      </div>
    )
  }
})

export default InputImage
