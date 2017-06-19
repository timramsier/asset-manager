import React from 'react'
import AssetTable from './AssetTable'
import { Grid, Row, Col } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

const { func, shape, string, array, bool } = React.PropTypes

const ModelModal = React.createClass({
  propTypes: {
    setModelModal: func,
    model: shape({
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
  },
  render () {
    let buttonEffect = {
      onClick: (event) => {
        event.preventDefault()
        this.props.setModelModal(false, {})
      }
    }
    const { model } = this.props
    let activeState
    if (model.active) {
      activeState = (<span><FontAwesome name='thumbs-up' className='fa-fw' /> Active</span>)
    } else {
      activeState = (<span><FontAwesome name='thumbs-down' className='fa-fw' /> Inactive</span>)
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
      <div className='asset-modal'>
        <Grid fluid>
          <Row className='header'>
            <Grid className='fluid-at-lg'>
              <Row>
                <Col xs={12} sm={4} smPush={8}>
                  <a className='modal-close' {...buttonEffect}>Close</a>
                </Col>
                <Col xs={12} sm={8} smPull={4}>
                  <h1>{model.name}{' '}<small>{model.vendor}</small></h1>
                  <h4>{model.version}</h4>
                  <h3>{model.description}</h3>
                  <div className='details'>
                    <span className='detail category' style={{backgroundColor: model.color}}>
                      <FontAwesome name={model._parent.config.faIcon} className='fa-fw' />{' '}
                      {model.category}
                    </span>
                    <span className={`detail active-${model.active}`}>
                      {activeState}
                    </span>
                  </div>
                </Col>
              </Row>
            </Grid>
          </Row>
          <Row className='body'>
            <Grid className='fluid-at-lg'>
              <Row>
                <Col xs={12} sm={4} smPush={8}>
                  <div className='info-card'>
                    <section className='image'>
                      <img src={thumbnailImage} className={`img-responsive ${thumbnailClass}`} />
                    </section>
                    <section className='specs'>
                      <h3>Specifications:</h3>
                      <table className='specs-table'>
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
                </Col>
                <Col xs={12} sm={8} smPull={4}>
                  <div className='assets'>
                    <h3>Assets</h3>
                    <AssetTable shortId={model._shortId} />
                  </div>
                </Col>
              </Row>
            </Grid>
          </Row>
        </Grid>
      </div>
    )
  }
})

export default ModelModal