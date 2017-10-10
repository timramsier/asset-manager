import React from 'react';
import { FormControl } from 'react-bootstrap';
import ReadOnly from './ReadOnly';

const { shape, string, func, oneOfType, bool, array, obj } = React.PropTypes;

const InputSelect = React.createClass({
  propTypes: {
    handleChange: func,
    setValidationState: func,
    addValidationError: func,
    removeValidationError: func,
    structure: shape({
      label: string,
      key: string,
      type: string,
      placeholder: string,
      description: string,
      options: oneOfType([array, func]),
      onChange: func,
      nullOption: obj,
    }),
    value: oneOfType([string, bool, obj]),
    updateFormDate: func,
  },
  getInitialState() {
    return {
      options: [],
    };
  },
  updateValidationError() {
    const { structure, value } = this.props;
    let valid;
    const inputName = `input_${structure.type}_${structure.key}`;
    if (value === 'null' || value === '') {
      valid = 'error';
      this.props.addValidationError(inputName);
    } else {
      valid = null;
      this.props.removeValidationError(inputName);
    }
    return valid;
  },
  setOptions(options) {
    const newState = this.state;
    Object.assign(newState, { options });
    this.setState(newState);
  },
  componentDidMount() {
    if (this.props.structure.options instanceof Function) {
      this.props.structure.options(this);
    } else {
      this.setOptions(this.props.structure.options);
    }
    this.updateValidationError();
  },
  render() {
    let onChange = event =>
      this.props.handleChange(event, this.props.structure.key);
    if (
      this.props.structure.onChange &&
      this.props.structure.onChange instanceof Function
    ) {
      onChange = event => this.props.structure.onChange(event, this);
    }
    const inputBehavior = {
      onChange,
      onBlur: () => {
        this.props.setValidationState(this.updateValidationError());
      },
    };
    const nullOption = this.props.structure.nullOption || {
      label: '--- Select One ---',
      value: 'null',
    };
    // Return Readonly if supplied value is not a valid option
    if (
      this.state.options.length > 0 &&
      this.state.options.indexOf(this.props.value) === -1 &&
      this.props.value
    ) {
      return <ReadOnly {...this.props} />;
    }
    return (
      <FormControl
        componentClass="select"
        placeholder="select"
        value={this.props.value}
        {...inputBehavior}
      >
        <option key={`key_null`} value={nullOption.value}>
          {nullOption.label}
        </option>
        {this.state.options.map(option => (
          <option key={`key_${option}`} value={option}>
            {`${option}`.charAt(0).toUpperCase() + `${option}`.slice(1)}
          </option>
        ))}
      </FormControl>
    );
  },
});

export default InputSelect;
