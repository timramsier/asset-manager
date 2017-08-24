import React from 'react'
import api from '../api'
import { Col, FormControl, FormGroup, ControlLabel, Grid, Button, Row } from 'react-bootstrap'
import { VelocityTransitionGroup } from 'velocity-react'
import FontAwesome from 'react-fontawesome'

const { array, object, shape, bool, func } = React.PropTypes

const AssetInput = React.createClass({
  propTypes: {
    options: shape({
      categories: array
    }),
    asset: object,
    newInput: bool,
    removeFormArray: func
  },
  getInitialState () {
    return ({
      models: [],
      values: {
        category: 'null',
        model: 'null',
        sn: ''
      }
    })
  },
  updateModelOptions (category) {
    let newState = this.state
    if (category !== 'null') {
      api.getModels(category)
      .then((models) => {
        Object.assign(newState, { models })
        this.setState(newState)
      })
    } else {
      Object.assign(newState, { models: [] })
      this.setState(newState)
    }
  },
  handleValueChange (values) {
    let newState = this.state
    Object.assign(newState.values, values)
    this.setState(newState)
  },
  componentWillMount () {
    if (this.props.asset) {
      this.handleValueChange({
        category: this.props.asset._parent.category,
        model: this.props.asset._parent._id,
        sn: this.props.asset.sn
      })
      this.updateModelOptions(this.props.asset._parent.category)
    }
  },
  render () {
    const { asset, options } = this.props
    const changeBehavior = {
      category: {
        onChange: (event) => {
          this.handleValueChange({ category: event.target.value })
          this.updateModelOptions(event.target.value)
        }
      },
      model: {
        onChange: (event) => {
          this.handleValueChange({ model: event.target.value })
        }
      },
      sn: {
        onChange: (event) => {
          this.handleValueChange({ sn: event.target.value })
        }
      }
    }
    let shortId = 'new'
    asset && (shortId = asset._shortId)
    const assetButton = {
      true: (<Button
        title='Add Asset to P.O.'
        bsStyle='success'>
        <FontAwesome name='plus' />
      </Button>),
      false: (<Button
        title='Remove Asset from P.O.'
        bsStyle='danger'
        onClick={(event) => {
          this.props.removeFormArray(asset._id, 'assets', true)
        }}
        >
        <FontAwesome name='trash' />
      </Button>)
    }
    return (
      <Grid className={`asset-input new-input-${!!this.props.newInput}`} key={`key_${shortId}`}>
        <Row>
          <Col sm={2}>
            <p className='input-shortid'><strong>ID: </strong>{shortId}</p>
            {assetButton[!!this.props.newInput]}
          </Col>
          <Col sm={10}>
            <Row>
              <VelocityTransitionGroup enter={{animation: 'fadeIn'}} leave={{animation: 'fadeOut'}}>
                <Col sm={4}>
                  <FormGroup>
                    <ControlLabel>Category</ControlLabel>
                    <FormControl
                      disabled={!this.props.newInput}
                      componentClass='select'
                      value={this.state.values.category}
                      {...changeBehavior.category}
                    >
                      <option key={`key_null`} value='null'>
                        --- Select One ---
                      </option>
                      {options.categories.map(category => (
                        <option
                          key={`key_${category}`}
                          value={category}>{category}</option>
                      ))}
                    </FormControl>
                  </FormGroup>
                </Col>
                {this.state.models &&
                  this.state.models.length > 0 && (
                  <Col sm={4}>
                    <FormGroup>
                      <ControlLabel>Model</ControlLabel>
                      <FormControl
                        disabled={!this.props.newInput}
                        componentClass='select'
                        value={this.state.values.model}
                        {...changeBehavior.model}
                      >
                        <option key={`key_null`} value='null'>
                          --- Select One ---
                        </option>
                        {this.state.models.map(model => (
                          <option
                            key={`key_${model._id}`}
                            value={model._id}>{model.name}</option>
                        ))}
                      </FormControl>
                    </FormGroup>
                  </Col>
                )}
                {this.state.models &&
                  this.state.models.length > 0 &&
                  this.state.values.model !== 'null' && (
                  <Col sm={4}>
                    <FormGroup>
                      <ControlLabel>Serial Number</ControlLabel>
                      <FormControl
                        disabled={!this.props.newInput}
                        type='text'
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
    )
  }
})

export default AssetInput
