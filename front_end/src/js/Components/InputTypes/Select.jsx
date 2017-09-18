import React from 'react';
import { FormControl } from 'react-bootstrap';

const { shape, string, func, oneOfType, bool, array } = React.PropTypes;

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
    }),
    value: oneOfType([string, bool]),
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
    return (
      <FormControl
        componentClass="select"
        placeholder="select"
        value={this.props.value}
        {...inputBehavior}
      >
        <option key={`key_null`} value="null">
          --- Select One ---
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
