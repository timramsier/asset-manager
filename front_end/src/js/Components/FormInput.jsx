import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Col, FormGroup, ControlLabel } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import {
  Text,
  TextArea,
  KeyValueGroup,
  Select,
  ImageUpload,
  AssetInputGroup,
  ReadOnly,
} from './InputTypes/InputType';
import HelperText from './HelperText';

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
    let Input;
    switch (structure.type) {
      case 'text':
        Input = Text;
        break;
      case 'textarea':
        Input = TextArea;
        break;
      case 'keyvalue':
        Input = KeyValueGroup;
        break;
      case 'select':
        Input = Select;
        break;
      case 'image':
        Input = ImageUpload;
        break;
      case 'asset':
        Input = AssetInputGroup;
        break;
      case 'readonly':
        Input = ReadOnly;
        break;
      default:
        Input = () => <span />;
    }
    return (
      <Col md={structure.colspan || 12}>
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
