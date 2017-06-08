import React from 'react'
import { Row } from 'react-bootstrap'
import ModelCard from './ModelCard'

const { string, shape, arrayOf, array } = React.PropTypes

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
    }))
  },
  render () {
    return (
      <Row className='row asset-grid'>
        {this.props.models.map((model) => {
          return (
            <ModelCard
              model={model}
              key={`model_${model._id}`}
            />
          )
        })}
      </Row>
    )
  }
})

export default ModelGrid
