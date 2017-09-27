import React from 'react';
import { FormControl } from 'react-bootstrap';

const { shape, string, func, oneOfType, array, number } = React.PropTypes;

const InputTextArea = React.createClass({
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
      height: number,
    }),
    value: oneOfType([string, array]),
  },
  updateValidationError() {
    const { structure, value } = this.props;
    let valid;
    const inputName = `input_${structure.type}_${structure.key}`;
    if (value.length < 2) {
      valid = 'error';
      this.props.addValidationError(inputName);
    } else {
      valid = null;
      this.props.removeValidationError(inputName);
    }
    return valid;
  },
  componentDidMount() {
    this.updateValidationError();
  },
  render() {
    const inputBehavior = {
      onChange: event =>
        this.props.handleChange(event, this.props.structure.key),
      onBlur: () => {
        this.props.setValidationState(this.updateValidationError());
      },
    };
    return (
      <FormControl
        style={{
          height: `${this.props.structure.height || 100}px`,
          resize: 'vertical',
        }}
        componentClass="textarea"
        // placeholder={this.props.structure.placeholder}
        {...inputBehavior}
        value={this.props.value}
      />
    );
  },
});

export default InputTextArea;
