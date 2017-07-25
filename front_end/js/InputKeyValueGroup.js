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
    resetArray: func
  },
  getInitialState () {
    return ({
      _array: []
    })
  },
  componentDidMount () {
    if (this.props.value instanceof Array) {
      // clone the array for form reset
      this.state._array = this.props.value.slice(0)
    }
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
  }
})

export default InputKeyValueGroup
