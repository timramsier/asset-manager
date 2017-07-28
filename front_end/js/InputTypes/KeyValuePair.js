import React from 'react'
import { FormControl, FormGroup, InputGroup, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

const { shape, string, func, object, bool, number } = React.PropTypes

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
    buttonEffect: func,
    setValidationState: func
  },
  getInitialState () {
    return ({
      key: '',
      value: '',
      validationState: null,
      newEntry: this.props.newEntry || false
    })
  },
  handleChange (event, key) {
    let newState = this.state
    Object.assign(newState, {[key]: event.target.value})
    this.setState(newState)
  },
  setValidationState (validationState) {
    let newState = this.state
    Object.assign(newState, { validationState })
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
    let inputHandler
    let key = ''
    let value = ''
    if (this.state.newEntry) {
      inputHandler = (event, keyName) => this.handleChange(event, keyName)
      key = this.state.key
      value = this.state.value
    } else {
      inputHandler = (event, keyName) => this.props.handleKeyValueChange(event, this.props.structure.key, keyName, this.props.shortId)
      if (this.props.data) {
        this.props.data.key ? key = this.props.data.key : undefined
        this.props.data.value ? value = this.props.data.value : undefined
      }
    }
    const blurHandler = (value) => {
      let valid
      value.length < 2 ? valid = 'error' : valid = null
      this.setValidationState(valid)
    }
    return (
      <div className={`keyvalue-group new-entry-${this.state.newEntry}`}>
        <FormGroup bsClass='clear-formatting' validationState={this.state.validationState}>
          <InputGroup>
            <InputGroup.Addon>
              Label:
            </InputGroup.Addon>
            <FormControl
              type='text'
              placeholder='Enter label'
              value={key || ''}
              onChange={(event) => inputHandler(event, 'key')}
              onBlur={(event) => blurHandler(key)}
            />
            <InputGroup.Addon>
              Value:
            </InputGroup.Addon>
            <FormControl
              type='text'
              placeholder='Enter value'
              value={value || ''}
              onChange={(event) => inputHandler(event, 'value')}
              onBlur={(event) => blurHandler(value)}
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
        </FormGroup>
      </div>
    )
  }
})

export default KeyValuePair
