import React from 'react'
import { Row } from 'react-bootstrap'
import AssetCard from './AssetCard'

const { string, shape, arrayOf, array } = React.PropTypes

const AssetGrid = React.createClass({
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
            <AssetCard
              model={model}
              key={`model_${model._id}`}
            />
          )
        })}
      </Row>
    )
  }
})

export default AssetGrid
