import React from 'react';
import shortid from 'shortid';
import { Col, Button, Well } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import FormInput from './FormInput';
import addConfirmModal from './addConfirmModal';
import { guid } from '../common';

const { shape, string, arrayOf, func, object, oneOfType } = React.PropTypes;

const Edit = React.createClass({
  propTypes: {
    form: shape({
      structure: arrayOf(
        shape({
          label: string,
          key: string,
          type: string,
          placeholder: string,
          description: oneOfType([string, object]),
          transformValue: func,
        })
      ),
      submit: func,
    }),
    data: object,
    _reset: object,
    setAdminModal: func,
    openConfirmModal: func,
    resetTable: func,
    flashMessage: func,
  },
  getInitialState() {
    return {
      shortId: '',
      method: 'put',
      form: {
        data: {},
        validationError: [],
        canSave: false,
        changeArray: [],
      },
    };
  },
  handleChange(event, key) {
    const newState = this.state;
    Object.assign(newState.form.data, { [key]: event.target.value });
    this.setState(newState);
    this.checkForDiff(key);
  },
  updateFormData(state) {
    const newState = this.state;
    Object.assign(newState.form.data, state);
    this.setState(newState);
  },
  pushNewKeyValueEntry(key, component) {
    const data = component.state;
    const newState = this.state;
    newState.form.data[key].push({
      _shortId: `temp_${shortid()}`,
      key: data.key,
      value: data.value,
    });
    this.setState(newState);
  },
  removeKeyValueEntry(key, component) {
    const newState = this.state;
    const index = newState.form.data[key].findIndex(
      i => i._shortId === component.props.shortId
    );
    if (index > -1) {
      newState.form.data[key].splice(index, 1);
      this.setState(newState);
    }
  },
  handleKeyValueChange(event, key, keyName, shortId) {
    const newState = this.state;
    const index = newState.form.data[key].findIndex(
      i => i._shortId === shortId
    );
    if (index > -1) {
      Object.assign(newState.form.data[key][index], {
        [keyName]: event.target.value,
      });
      this.setState(newState);
      this.checkForDiff({ key, index }, shortId);
    }
  },
  addValidationError(inputName) {
    const newState = this.state;
    if (
      !this.state.form.validationError ||
      this.state.form.validationError.indexOf(inputName) < 0
    ) {
      const validationError = newState.form.validationError || [];
      validationError.push(inputName);
      Object.assign(newState.form, { validationError });
      this.setState(newState);
    }
  },
  removeValidationError(inputName) {
    const newState = this.state;
    if (this.state.form.validationError) {
      const validationError = newState.form.validationError || [];
      const index = validationError.indexOf(inputName);
      if (index >= 0) {
        validationError.splice(index, 1);
        Object.assign(newState.form, { validationError });
        this.setState(newState);
      }
    }
  },
  checkValidation() {
    return (
      !this.state.form.validationError ||
      this.state.form.validationError.length === 0
    );
  },
  checkIfDiff() {
    return !(
      !this.state.form.changeArray || this.state.form.changeArray.length === 0
    );
  },
  setSaveState(value) {
    const newState = this.state;
    Object.assign(newState.form, { canSave: value });
    this.setState(newState);
  },
  updateSaveState() {
    const newState = this.state;
    if (this.checkIfDiff() && this.checkValidation()) {
      Object.assign(newState.form, { canSave: true });
    } else {
      Object.assign(newState.form, { canSave: false });
    }
    this.setState(newState);
  },
  checkForDiff(target, hash = '0') {
    let ref;
    let diff;
    let inputName;
    if (target instanceof Object) {
      const { key, index } = target;
      inputName = `input_${key}_${hash}`;

      ref = JSON.stringify(this.state.form.data[key][index]);

      diff = JSON.stringify(this.props._reset[key][index]);

      if (ref.key !== diff.key || ref.value !== diff.value) {
        this.addFormArray(inputName, 'changeArray');
      } else {
        this.removeFormArray(inputName, 'changeArray');
      }
    } else {
      inputName = `input_${target}_${hash}`;

      ref = JSON.stringify(this.state.form.data[target]);

      diff = JSON.stringify(this.props._reset[target]);

      if (ref !== diff) {
        this.addFormArray(inputName, 'changeArray');
      } else {
        this.removeFormArray(inputName, 'changeArray');
      }
    }
    this.updateSaveState();
  },
  addFormArray(inputName, arrayName, data = false) {
    const newState = this.state;
    if (!data) {
      if (
        !this.state.form[arrayName] ||
        this.state.form[arrayName].indexOf(inputName) < 0
      ) {
        const array = newState.form[arrayName] || [];
        array.push(inputName);
        Object.assign(newState.form, { [arrayName]: array });
      }
    } else if (
      !this.state.form[arrayName] ||
      this.state.form[arrayName].indexOf(inputName) < 0
    ) {
      const array = newState.form.data[arrayName] || [];
      array.push(inputName);
      Object.assign(newState.form.data, { [arrayName]: array });
    }
    this.setState(newState);
  },
  removeFormArray(inputName, arrayName, data = false) {
    const newState = this.state;
    if (!data) {
      if (this.state.form[arrayName]) {
        const array = newState.form[arrayName] || [];
        const index = array.indexOf(inputName);
        if (index >= 0) {
          array.splice(index, 1);
          Object.assign(newState.form, { [arrayName]: array });
        }
      }
    } else if (this.state.form.data[arrayName]) {
      const array = newState.form.data[arrayName] || [];
      const index = array.indexOf(inputName);
      if (index >= 0) {
        array.splice(index, 1);
        Object.assign(newState.form.data, { [arrayName]: array });
      }
    }
    this.setState(newState);
  },
  sendData() {
    if (this.props.form.submit && this.props.form.submit instanceof Function) {
      return this.props.form.submit(this);
    }
    return new Promise(resolve => {
      console.warn('no submit function provided in adminMenuSettings.js');
      resolve(false);
    });
  },
  componentWillMount() {
    const { data } = this.props;
    let shortId = this.props.data._shortId;
    let title = 'Edit';
    let method = 'put';
    let tempId;
    if (Object.keys(data).length === 0 && data.constructor === Object) {
      title = 'New';
      method = 'post';
      shortId = '';
      tempId = `temp_${guid()}`;
      this.props.form.structure.forEach(entry => {
        if (entry.type === 'keyvalue') {
          data[entry.key] = [];
        } else {
          data[entry.key] = '';
        }
      });
    }
    this.setState({ title, tempId, method, shortId, form: { data } });
  },
  render() {
    const formStructure = this.props.form.structure || [];
    const buttonEffects = {
      cancel: {
        onClick: event => {
          event.preventDefault();
          if (this.checkIfDiff()) {
            this.props.openConfirmModal({
              modalType: 'warning',
              header: 'Cancel',
              body: 'If you leave this page, you will lose any unsaved changes',
              onConfirm: () => this.props.setAdminModal(false),
            });
          } else {
            this.props.setAdminModal(false);
          }
        },
      },
      save: {
        onClick: event => {
          event.preventDefault();
          if (this.checkValidation()) {
            this.props.openConfirmModal({
              modalType: 'info',
              header: 'Save',
              body: 'Are you sure you want to save your changes?',
              onConfirm: () => {
                this.sendData()
                  .then(this.props.resetTable)
                  .then(() => {
                    this.props.flashMessage(
                      'success',
                      <span>
                        Successfully updated{' '}
                        <strong>
                          {this.state.form.data.name ||
                            this.state.form.data.poNumber}
                        </strong>.
                      </span>
                    );
                  });
                this.props.setAdminModal(false);
              },
            });
          } else {
            this.props.openConfirmModal({
              modalType: 'danger',
              header: 'Oops',
              body: 'Make sure that you have the from filled out completely.',
              noCancel: true,
            });
          }
        },
      },
    };
    let description;
    let title;
    if (this.props.form.header) {
      if (this.props.form.header.title) {
        title = this.props.form.header.title;
      }
      description = (
        <Well className="admin-edit-description">
          {this.props.form.header.description}
        </Well>
      );
    }
    return (
      <div className="admin-edit-modal">
        <Col md={8} className="col-md-offset-2">
          <h1>
            {title} - {this.state.title}{' '}
            <small title="shortId">{this.props.data._shortId}</small>
          </h1>
          <form>
            {description}
            {formStructure.map(input => {
              let value = this.state.form.data[input.key];
              if (
                input.transformValue &&
                input.transformValue instanceof Function
              ) {
                value = input.transformValue(this.state.form.data[input.key]);
              }
              let label = '';
              if (input.label) label = input.label.replace(' ', '');
              if (input.type) {
                return (
                  <FormInput
                    tempId={this.state.tempId}
                    key={`input_${input.key}_${label}`}
                    formData={this.state.form.data}
                    value={value}
                    structure={input}
                    addFormArray={this.addFormArray}
                    removeFormArray={this.removeFormArray}
                    updateFormData={this.updateFormData}
                    removeKeyValueEntry={this.removeKeyValueEntry}
                    pushNewKeyValueEntry={this.pushNewKeyValueEntry}
                    handleChange={this.handleChange}
                    updateSaveState={this.updateSaveState}
                    handleKeyValueChange={this.handleKeyValueChange}
                    addValidationError={this.addValidationError}
                    removeValidationError={this.removeValidationError}
                    checkForDiff={this.checkForDiff}
                    setSaveState={this.setSaveState}
                  />
                );
              }
              return <span key={`input_${input.key}_${label}`} />;
            })}
            <div className="form-buttons">
              <Button bsStyle="danger" {...buttonEffects.cancel}>
                <FontAwesome className="fa-fw" name="times" />Cancel
              </Button>
              <Button
                bsStyle="success"
                disabled={!this.state.form.canSave}
                {...buttonEffects.save}
              >
                <FontAwesome className="fa-fw" name="check" />Save
              </Button>
            </div>
          </form>
        </Col>
      </div>
    );
  },
});

export default addConfirmModal(Edit);
