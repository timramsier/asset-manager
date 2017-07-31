import React from 'react'
import KeyValuePair from './KeyValuePair'

const { shape, string, func, array } = React.PropTypes

const InputKeyValueGroup = React.createClass({
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
    value: array,
    handleKeyValueChange: func,
    setValidationState: func,
    addValidationError: func,
    removeValidationError: func,
    resetArray: func
  },
  render () {
    let { structure } = this.props
    return (
      <div className='multi-keyvalue-box'>
        {this.props.value.map((entry) => {
          return (
            <KeyValuePair
              handleKeyValueChange={this.props.handleKeyValueChange}
              buttonEffect={this.props.removeKeyValueEntry}
              structure={structure}
              key={entry._shortId}
              data={entry}
              shortId={entry._shortId}
              setValidationState={this.props.setValidationState}
            />
          )
        })}
        <KeyValuePair
          newEntry
          buttonEffect={this.props.pushNewKeyValueEntry}
          structure={structure}
          setValidationState={this.props.setValidationState}
        />
      </div>
    )
  }
})

export default InputKeyValueGroup