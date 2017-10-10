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
      feedback: {
        color: 'black',
        message: null,
      },
      enterSecond: false,
      canSave: false,
      values: {
        first: '',
        second: '',
      },
    };
  },
  showFeedback({ message, color }) {
    const newState = this.state;
    Object.assign(newState.feedback, { message, color });
    this.setState(newState);
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
    if (
      this.state.values.second &&
      this.state.values.first &&
      this.state.values.second === this.state.values.first
    ) {
      Object.assign(newState, { canSave: true });
    } else {
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
          this.toggleOpen();
          this.showFeedback({
            color: '#5cb85c',
            message: 'Password Updated.',
          });
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
    // add margin to feedback message if message
    let marginBottom = 0;
    if (this.state.feedback.message) {
      marginBottom = '15px';
    }
    return (
      <div className="input-password">
        <div
          className="feedback"
          style={{ color: this.state.feedback.color, marginBottom }}
        >
          {this.state.feedback.message}
        </div>
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
