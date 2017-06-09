import React from 'react'
import { Row } from 'react-bootstrap'
import ModelCard from './ModelCard'
import AssetModal from './AssetModal'
import { VelocityTransitionGroup } from 'velocity-react'

const { string, shape, arrayOf, array, bool } = React.PropTypes

const ModelGrid = React.createClass({
  propTypes: {
    models: arrayOf(shape({
      _id: string,
      vendor: string,
      name: string,
      version: string,
      image: string,
      description: string,
      assets: array
    })),
    assetModal: shape({
      open: bool,
      data: shape({
        _id: string,
        vendor: string,
        name: string,
        version: string,
        image: string,
        description: string,
        assets: array
      })
    })
  },
  getInitialState () {
    return ({
      assetModal: {
        open: false,
        data: {}
      }
    })
  },
  setAssetModal (open, modalData) {
    const newState = this.state
    Object.assign(newState.assetModal, {
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
    const assetModalAnimationProps = {
      runOnMount: true,
      enter: {
        animation: {
          scale: 1.0,
          opacity: 1.0
        },
        duration: 400
      },
      leave: {
        animation: {
          scale: 0.5,
          opacity: 0.0
        },
        duration: 400
      }
    }
    return (
      <Row className='row asset-grid'>
        <VelocityTransitionGroup {...assetModalAnimationProps}>
          {this.state.assetModal.open ? <AssetModal setAssetModal={this.setAssetModal} model={this.state.assetModal.data} /> : undefined}
        </VelocityTransitionGroup>
        {this.props.models.map((model) => {
          return (
            <ModelCard
              model={model}
              key={`model_${model._id}`}
              setAssetModal={this.setAssetModal}
            />
          )
        })}
      </Row>
    )
  }
})

export default ModelGrid