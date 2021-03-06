import React from 'react';
import {
  Col,
  FormControl,
  FormGroup,
  ControlLabel,
  Grid,
  Button,
  Row,
} from 'react-bootstrap';
import { VelocityTransitionGroup } from 'velocity-react';
import FontAwesome from 'react-fontawesome';
import api from '../../api';
import { guid } from '../../common';

const { array, object, shape, bool, func } = React.PropTypes;

const AssetInput = React.createClass({
  propTypes: {
    options: shape({
      categories: array,
    }),
    asset: object,
    newInput: bool,
    removeFormArray: func,
    addFormArray: func,
    pushNewAsset: func,
    updateSaveState: func,
  },
  getInitialState() {
    return {
      models: [],
      values: {
        category: 'null',
        model: 'null',
        sn: '',
      },
      validation: {
        category: null,
        model: null,
        sn: null,
      },
      validationArray: [],
    };
  },
  setValidationState(validation) {
    const newState = this.state;
    Object.assign(newState, { validation });
    this.setState(newState);
  },
  updateModelOptions(category) {
    const newState = this.state;
    if (category !== 'null') {
      api.getModels(category, { active: true }).then(models => {
        Object.assign(newState, { models });
        this.setState(newState);
      });
    } else {
      Object.assign(newState, { models: [] });
      this.setState(newState);
    }
  },
  handleValueChange(values) {
    const newState = this.state;
    Object.assign(newState.values, values);
    this.setState(newState);
  },
  componentWillMount() {
    if (this.props.asset) {
      this.handleValueChange({
        category: this.props.asset._parent.category,
        model: this.props.asset._parent._id,
        sn: this.props.asset.sn,
      });
      this.updateModelOptions(this.props.asset._parent.category);
    }
  },
  checkValidation() {
    return (
      Object.values(this.state.values).filter(i => i === 'null' || i === '')
        .length === 0
    );
  },
  render() {
    const { asset, options } = this.props;
    const changeBehavior = {
      category: {
        onChange: event => {
          this.handleValueChange({ category: event.target.value });
          this.updateModelOptions(event.target.value);
        },
        onBlur: () => {
          let category = null;
          if (this.state.values.category === 'null') category = 'error';
          this.setValidationState({ category });
        },
      },
      model: {
        onChange: event => {
          this.handleValueChange({ model: event.target.value });
        },
        onBlur: () => {
          let model = null;
          if (this.state.values.model === 'null') model = 'error';
          this.setValidationState({ model });
        },
      },
      sn: {
        onChange: event => {
          this.handleValueChange({ sn: event.target.value });
        },
        onBlur: () => {
          let sn = null;
          if (this.state.values.sn.length < 1) sn = 'error';
          this.setValidationState({ sn });
        },
      },
    };
    let shortId = 'new';
    if (asset) shortId = asset._shortId;
    const assetButton = {
      true: (
        <Button
          title="Add Asset to P.O."
          bsStyle="success"
          onClick={() => {
            const _id = `new_${guid()}`;
            const { model, category, sn } = this.state.values;
            const newAsset = {
              _id,
              sn,
              _parent: {
                _id: model,
                category,
              },
            };
            if (this.checkValidation()) {
              this.props.pushNewAsset(newAsset);
              this.props.addFormArray(newAsset, 'newAssets', true);
              this.props.addFormArray(_id, 'assets', true);
              this.props.addFormArray(_id, 'changeArray');
            }
            this.props.updateSaveState();
          }}
        >
          <FontAwesome name="plus" />
        </Button>
      ),
      false: (
        <Button
          title="Remove Asset from P.O."
          bsStyle="danger"
          onClick={() => {
            this.props.removeFormArray(asset._id, 'assets', true);
            if (asset._id.startsWith('new_')) {
              this.props.removeFormArray(asset._id, 'changeArray');
              this.props.removeFormArray(asset, 'newAssets', true);
            } else {
              this.props.addFormArray(asset._shortId, 'removeAssets');
              this.props.addFormArray(asset._id, 'changeArray');
            }
            this.props.updateSaveState();
          }}
        >
          <FontAwesome name="trash" />
        </Button>
      ),
    };
    return (
      <Grid
        className={`asset-input new-input-${!!this.props.newInput}`}
        key={`key_${shortId}`}
      >
        <Row>
          <Col sm={2}>
            <p className="input-shortid">
              <strong>ID: </strong>
              {shortId}
            </p>
            {assetButton[!!this.props.newInput]}
          </Col>
          <Col sm={10}>
            <Row>
              <VelocityTransitionGroup
                enter={{ animation: 'fadeIn' }}
                leave={{ animation: 'fadeOut' }}
              >
                <Col sm={4}>
                  <FormGroup validationState={this.state.validation.category}>
                    <ControlLabel>Category</ControlLabel>
                    <FormControl
                      // disabled={!this.props.newInput}
                      componentClass="select"
                      value={this.state.values.category}
                      {...changeBehavior.category}
                    >
                      <option key={`key_null`} value="null">
                        --- Select One ---
                      </option>
                      {options.categories.map(category => (
                        <option key={`key_${category}`} value={category}>
                          {category}
                        </option>
                      ))}
                    </FormControl>
                  </FormGroup>
                </Col>
                {this.state.models &&
                  this.state.models.length > 0 && (
                    <Col sm={4}>
                      <FormGroup validationState={this.state.validation.model}>
                        <ControlLabel>Model</ControlLabel>
                        <FormControl
                          disabled={!this.props.newInput}
                          componentClass="select"
                          value={this.state.values.model}
                          {...changeBehavior.model}
                        >
                          <option key={`key_null`} value="null">
                            --- Select One ---
                          </option>
                          {this.state.models.map(model => (
                            <option key={`key_${model._id}`} value={model._id}>
                              {model.name}
                            </option>
                          ))}
                        </FormControl>
                      </FormGroup>
                    </Col>
                  )}
                {this.state.models &&
                  this.state.models.length > 0 &&
                  this.state.values.model !== 'null' && (
                    <Col sm={4}>
                      <FormGroup validationState={this.state.validation.sn}>
                        <ControlLabel>Serial Number</ControlLabel>
                        <FormControl
                          disabled={!this.props.newInput}
                          type="text"
                          value={this.state.values.sn}
                          {...changeBehavior.sn}
                        />
                      </FormGroup>
                    </Col>
                  )}
              </VelocityTransitionGroup>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  },
});

export default AssetInput;
