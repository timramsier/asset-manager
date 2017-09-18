import React from 'react';
import { VelocityTransitionGroup } from 'velocity-react';
import KeyValuePair from './KeyValuePair';

const { shape, string, func, array } = React.PropTypes;

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
      description: string,
    }),
    value: array,
    handleKeyValueChange: func,
    setValidationState: func,
    addValidationError: func,
    removeValidationError: func,
    resetArray: func,
    addFormArray: func,
    removeFormArray: func,
    setSaveState: func,
  },
  render() {
    const { structure } = this.props;
    const value = this.props.value || [];
    return (
      <div className="multi-keyvalue-box">
        <VelocityTransitionGroup
          enter={{ animation: 'slideDown' }}
          leave={{ animation: 'slideUp' }}
        >
          {value.map(entry => (
            <KeyValuePair
              handleKeyValueChange={this.props.handleKeyValueChange}
              buttonEffect={this.props.removeKeyValueEntry}
              structure={structure}
              key={entry._shortId}
              data={entry}
              shortId={entry._shortId}
              setValidationState={this.props.setValidationState}
              addValidationError={this.props.addValidationError}
              removeValidationError={this.props.removeValidationError}
              addFormArray={this.props.addFormArray}
              setSaveState={this.props.setSaveState}
            />
          ))}
        </VelocityTransitionGroup>
        <KeyValuePair
          newEntry
          buttonEffect={this.props.pushNewKeyValueEntry}
          structure={structure}
          setValidationState={this.props.setValidationState}
          addValidationError={this.props.addValidationError}
          removeValidationError={this.props.removeValidationError}
          addFormArray={this.props.addFormArray}
          setSaveState={this.props.setSaveState}
        />
      </div>
    );
  },
});

export default InputKeyValueGroup;
