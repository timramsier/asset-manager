import React from 'react';
import { FormControl, Button } from 'react-bootstrap';

const { shape, string, func, oneOfType, array } = React.PropTypes;

const InputPassword = React.createClass({
  propTypes: {
    handleChange: func,
    setValidationState: func,
    addValidationError: func,
    removeValidationError: func,
    addFormArray: func,
    structure: shape({
      label: string,
      key: string,
      type: string,
      placeholder: string,
      description: string,
    }),
    value: oneOfType([string, array]),
  },
  getInitialState() {
    return {
      open: false,
      enterSecond: false,
      canSave: false,
      values: {
        first: '',
        second: '',
      },
    };
  },
  testPassword(password) {
    // must contain 1 number, one letter, and one special character
    // and be between 6 and 18 characters
    const passStrength = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return passStrength.test(password);
  },
  toggleOpen() {
    const newState = this.state;
    Object.assign(newState, { open: !this.state.open });
    this.setState(newState);
  },
  updateValue(key, value) {
    const newState = this.state;
    Object.assign(newState.values, { [key]: value });
    // Allow verification to be entered if first password passes test
    if (key === 'first' && this.testPassword(value)) {
      Object.assign(newState, { enterSecond: true });
    } else if (key === 'first' && !this.testPassword(value)) {
      Object.assign(newState, { enterSecond: false });
    }

    // Allow password to be saved if second password matches first
    if (key === 'second' && value === this.state.values.first) {
      Object.assign(newState, { canSave: true });
    } else if (key === 'second' && value !== this.state.values.first) {
      Object.assign(newState, { canSave: false });
    }
    this.setState(newState);
  },
  render() {
    const buttonBehavior = {
      default: {
        onClick: () => {
          this.updateValue('first', '');
          this.updateValue('second', '');
          this.toggleOpen();
        },
      },
      save: {
        onClick: () => {
          const { key } = this.props.structure;
          this.props.handleChange(
            {
              target: {
                value: this.state.values.first,
              },
            },
            'newPassword'
          );
          this.props.addFormArray(`input_${key}`, 'changeArray');
        },
      },
    };
    const inputBehavior = {
      first: {
        onChange: event => {
          this.updateValue('first', event.target.value);
        },
      },
      second: {
        onChange: event => {
          this.updateValue('second', event.target.value);
        },
      },
    };
    return (
      <div className="input-password">
        {!this.state.open ? (
          <Button {...buttonBehavior.default}>Update Password</Button>
        ) : (
          <div className="input-password-open">
            <FormControl
              type="password"
              placeholder="Enter password"
              {...inputBehavior.first}
            />
            <FormControl
              type="password"
              placeholder="Verify password"
              disabled={!this.state.enterSecond}
              {...inputBehavior.second}
            />
            <Button {...buttonBehavior.save} disabled={!this.state.canSave}>
              Save
            </Button>
            <Button {...buttonBehavior.default}>Cancel</Button>
          </div>
        )}
      </div>
    );
  },
});

export default InputPassword;
