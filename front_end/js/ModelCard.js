import React from 'react'
import ReactDOM from 'react-dom'
import { Col } from 'react-bootstrap'
import { VelocityComponent } from 'velocity-react'

const { string, shape, array, arrayOf, func } = React.PropTypes

const ModelCard = React.createClass({
  propTypes: {
    color: string,
    model: shape({
      _id: string,
      vendor: string,
      name: string,
      version: string,
      image: string,
      description: string,
      category: string,
      assets: array,
      specs: arrayOf(shape({
        key: string,
        value: string
      }))
    }),
    setModelModal: func
  },
  getInitialState () {
    return ({
      hovering: false,
      orientation: 'left'
    })
  },
  testOnRightEdge (elem) {
    const _p = elem.getBoundingClientRect()
    const _w = window.innerWidth
    return (_w - _p.right < _p.width)
  },
  setOrientation (orientation) {
    let newState = this.state
    Object.assign(newState, {orientation})
    this.setState(newState)
  },
  componentDidMount () {
    const _orient = () => {
      if (this.testOnRightEdge(ReactDOM.findDOMNode(this))) {
        this.setOrientation('right')
      } else {
        this.setOrientation('left')
      }
    }
    _orient()
    window.addEventListener('resize', (event) => {
      _orient()
    })
  },
  render () {
    const hoverEffect = {
      onMouseEnter: () => {
        let newState = this.state
        Object.assign(newState, {hovering: true})
        this.setState(newState)
      },
      onMouseLeave: () => {
        let newState = this.state
        Object.assign(newState, {hovering: false})
        this.setState(newState)
      }
    }
    const clickEffect = {
      onClick: (event) => {
        event.preventDefault()
        let modelData = this.props.model
        modelData.color = model._parent.config.color
        this.props.setModelModal(true, modelData)
      }
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
    const { model } = this.props
    let active
    let cardProps
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
      cardProps = {
        filter: 'saturate(10%) contrast(70%) brightness(90%)'
      }
    }
    let thumbnailImage,
      thumbnailClass
    if (model.image) {
      thumbnailImage = model.image
      thumbnailClass = 'with-image'
    } else {
      thumbnailImage = model._parent.config.fallbackImage
      thumbnailClass = 'no-image'
    }
    return (
      <Col xs={6} sm={6} md={4} lg={3} className='asset'>
        <a
          className='asset-card'
          href={`/show/${model._parent.label}/${model._shortId}`}
          {...hoverEffect} {...clickEffect}
          >
          <VelocityComponent {...animationPropsAsset}>
            <div className={`thumbnail ${thumbnailClass} `} style={cardProps}>
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
          <div className={`details-card orientation-${this.state.orientation}`}
            style={styleProps}
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
                  <span style={{backgroundColor: model._parent.config.color}} className='tag'>
                    <p>{model._parent.name}</p>
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
                          <tr key={`spec_${spec._id}_${spec.key}`}>
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

export default ModelCard
