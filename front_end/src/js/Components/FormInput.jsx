import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Col, FormGroup, ControlLabel } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import HelperText from './HelperText';
import getInputType from '../helpers/getInputType';

const { shape, string, func, oneOfType, array, bool, object } = React.PropTypes;

const FormInput = React.createClass({
  propTypes: {
    handleChange: func,
    pushNewKeyValueEntry: func,
    removeKeyValueEntry: func,
    addValidationError: func,
    removeValidationError: func,
    updateSaveState: func,
    structure: shape({
      label: string,
      key: string,
      type: string,
      placeholder: string,
      description: oneOfType([string, object]),
      options: oneOfType([array, func]),
      onChange: func,
    }),
    value: oneOfType([string, array, bool]),
    handleKeyValueChange: func,
    updateFormData: func,
  },
  getInitialState() {
    return {
      thisElement: null,
      validationState: null,
    };
  },
  setValidationState(validationState) {
    const newState = this.state;
    Object.assign(newState, { validationState });
    this.setState(newState);
  },
  setThisElement() {
    const newState = this.state;
    Object.assign({ thisElement: findDOMNode(this) });
    this.setState(newState);
  },
  componentDidMount() {
    this.setThisElement();
  },
  render() {
    const { structure } = this.props;
    const Input = getInputType(structure.type);
    return (
      <Col sm={structure.colspan || 12}>
        <FormGroup
          className="form-item"
          validationState={this.state.validationState}
        >
          <ControlLabel>
            {structure.label}
            <span className="helper">
              <FontAwesome className="fa-fw" name="info-circle" />
              <HelperText>{this.props.structure.description}</HelperText>
            </span>
          </ControlLabel>
          <Input setValidationState={this.setValidationState} {...this.props} />
        </FormGroup>
      </Col>
    );
  },
});

export default FormInput;
