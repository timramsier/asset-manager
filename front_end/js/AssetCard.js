import React from 'react'
import { Col } from 'react-bootstrap'
import { VelocityComponent } from 'velocity-react'

const { string, shape, array, arrayOf } = React.PropTypes

const AssetCard = React.createClass({
  propTypes: {
    category: shape({
      id: string,
      name: string,
      label: string,
      faIcon: string,
      color: string,
      api: string,
      fallbackImage: string
    }),
    model: shape({
      id: string,
      vendor: string,
      name: string,
      version: string,
      bgImage: string,
      description: string,
      assets: array,
      specs: arrayOf(shape({
        key: string,
        value: string
      }))
    })
  },
  getInitialState () {
    return ({
      hovering: false
    })
  },
  render () {
    const hoverEffect = {
      onMouseEnter: () => { this.setState({hovering: true}) },
      onMouseLeave: () => { this.setState({hovering: false}) }
    }
    let animationPropsDetails,
      animationPropsAsset,
      styleProps
    if (this.state.hovering) {
      animationPropsAsset = {
        animation: {
          scale: 1.03,
          visibility: 'visable'
        },
        duration: 200
      }
      animationPropsDetails = {
        animation: {
          opacity: 1.0,
          visibility: 'visable'
        },
        duration: 200
      }
      styleProps = {
        zIndex: 1
      }
    } else {
      animationPropsAsset = {
        animation: {
          scale: 1.0,
          visibility: 'visable'
        },
        duration: 200
      }
      animationPropsDetails = {
        animation: {
          opacity: 0,
          visibility: 'hidden',
          zIndex: -1
        },
        duration: 400
      }
    }
    const { model, category } = this.props
    let active
    if (model.active) {
      active = {
        color: '#00cca3',
        text: 'Active'
      }
    } else {
      active = {
        color: '#b3b3b3',
        text: 'Inactive'
      }
    }
    let thumbnailImage,
      thumbnailClass
    if (model.bgImage) {
      thumbnailImage = model.bgImage
      thumbnailClass = 'with-image'
    } else {
      thumbnailImage = category.fallbackImage
      thumbnailClass = 'no-image'
    }
    return (
      <Col xs={6} sm={6} md={4} lg={3} className='asset'>
        <a
          className='asset-card'
          href={`/show/${category.name}/${model.id}`}
          {...hoverEffect}
          >
          <VelocityComponent {...animationPropsAsset}>
            <div className={`thumbnail ${thumbnailClass} `}>
              <div className='image'>
                <div className='asset-img' style={{backgroundImage: `url(${thumbnailImage})`}} />
              </div>
              <div className='caption'>
                <h3>{model.name}</h3>
                <h5>{model.version}</h5>
              </div>
            </div>
          </VelocityComponent>
        </a>
        <VelocityComponent {...animationPropsDetails}>
          <div className='details-card' style={styleProps}
            {...hoverEffect} >
            <div className='details-card-container'>
              <div className='content'>
                <section className='title'>
                  {model.name}
                </section>
                <section className='tags'>
                  <span style={{backgroundColor: active.color}} className='tag'>
                    <p>{active.text}</p>
                  </span>
                  <span style={{backgroundColor: category.color}} className='tag'>
                    <p>{category.name}</p>
                  </span>
                </section>
                <hr />
                <section className='description'>
                  <p>
                    {model.description}
                  </p>
                </section>
                <hr />
                <section className='specs'>
                  <table>
                    <tbody>
                      {model.specs.map((spec) => {
                        return (
                          <tr key={`spec_${spec.id}_${spec.key}`}>
                            <td>{spec.key}:</td>
                            <td>{spec.value}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </section>
              </div>
            </div>
          </div>
        </VelocityComponent>
      </Col>
    )
  }
})

export default AssetCard
