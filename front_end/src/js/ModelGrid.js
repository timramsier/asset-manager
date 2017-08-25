import React from 'react'
import { Row } from 'react-bootstrap'
import ModelCard from './ModelCard'
import ModelModal from './ModelModal'
import { VelocityTransitionGroup } from 'velocity-react'

const { string, shape, array, bool, func, arrayOf, object } = React.PropTypes

const ModelGrid = React.createClass({
  propTypes: {
    models: arrayOf(shape({
      _id: string,
      vendor: string,
      active: bool,
      name: string,
      version: string,
      image: string,
      description: string,
      assets: array,
      _parent: shape({
        _id: string,
        name: string,
        description: string,
        label: string,
        config: shape({
          faIcon: string,
          color: string,
          api: string,
          fallbackImage: string
        }),
        _shortId: string
      })
    })),
    modelModal: shape({
      open: bool,
      data: shape({
        _id: string,
        vendor: string,
        active: bool,
        name: string,
        version: string,
        image: string,
        description: string,
        assets: array,
        _parent: shape({
          _id: string,
          name: string,
          description: string,
          label: string,
          config: shape({
            faIcon: string,
            color: string,
            api: string,
            fallbackImage: string
          }),
          _shortId: string
        })
      })
    }),
    checkVisible: func,
    apiHandler: object
  },
  getInitialState () {
    return ({
      modelModal: {
        open: false,
        data: {}
      }
    })
  },
  setModelModal (open, modalData) {
    const newState = this.state
    Object.assign(newState.modelModal, {
      open: open,
      data: modalData
    })
    this.setState(newState)
    // locks .main-content from scrolling when modal is open
    if (open) {
      document.querySelectorAll('.main-content').forEach((element) => {
        element.style.bottom = 0
      })
    } else {
      document.querySelectorAll('.main-content').forEach((element) => {
        element.style.bottom = 'auto'
      })
    }
  },
  render () {
    const modelModalAnimationProps = {
      runOnMount: true,
      enter: {
        animation: {
          top: 0,
          opacity: 1.0
        },
        duration: 400
      },
      leave: {
        animation: {
          top: '100%',
          opacity: 0.0
        },
        duration: 400
      }
    }
    return (
      <Row className='row asset-grid'>
        <VelocityTransitionGroup {...modelModalAnimationProps}>
          {this.state.modelModal.open && <ModelModal
            setModelModal={this.setModelModal}
            apiHandler={this.props.apiHandler}
            model={this.state.modelModal.data} /> }
        </VelocityTransitionGroup>
        {this.props.models.map((model) => {
          return (
            <ModelCard
              model={model}
              key={`model_${model._id}`}
              setModelModal={this.setModelModal}
              checkVisible={this.props.checkVisible}
            />
          )
        })}
      </Row>
    )
  }
})

export default ModelGrid
