import React from 'react'
import { FormControl, InputGroup, Button } from 'react-bootstrap'
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

export default KeyValuePair
