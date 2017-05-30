import React from 'react'
import { Row } from 'react-bootstrap'
import AssetCard from './AssetCard'

const { string, shape, arrayOf, array } = React.PropTypes

const AssetGrid = React.createClass({
  propTypes: {
    category: shape({
      id: string,
      name: string,
      label: string,
      faIcon: string,
      color: string,
      api: string
    }),
    models: arrayOf(shape({
      id: string,
      vendor: string,
      name: string,
      version: string,
      bgImage: string,
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
              category={this.props.category}
              key={`model_${model.id}`}
            />
          )
        })}
      </Row>
    )
  }
})

export default AssetGrid
