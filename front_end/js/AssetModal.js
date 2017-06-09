import React from 'react'
import AssetTable from './AssetTable'
import { Grid, Row, Col } from 'react-bootstrap'

const { func, shape, string, arrayOf, array, bool } = React.PropTypes

const AssetModal = React.createClass({
  propTypes: {
    setAssetModal: func,
    model: shape({
      _shortId: string,
      _id: string,
      vendor: string,
      active: bool,
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
    })
  },
  render () {
    let buttonEffect = {
      onClick: (event) => {
        event.preventDefault()
        this.props.setAssetModal(false, {})
      }
    }
    const { model } = this.props
    return (
      <div className='asset-modal'>
        <Grid fluid>
          <Row className='header'>
            <Grid>
              <Row>
                <Col xs={12} md={4} mdPush={8}>
                  <a className='modal-close' {...buttonEffect}>Close</a>
                </Col>
                <Col xs={12} md={8} mdPull={4}>
                  <h1>{model.name}</h1>
                  <h3>{model.description}</h3>
                  <div className='details'>
                    <span className={`detail active-${model.active}`}>{model.active ? 'Active' : 'Inactive'}</span>
                    <span className='detail category' style={{backgroundColor: model.color}}>{model.category}</span>
                  </div>
                </Col>
              </Row>
            </Grid>
          </Row>
          <Row className='body'>
            <Grid>
              <Row>
                <Col xs={12} md={8}>
                  <div className='assets'>
                    <h3>Assets</h3>
                    <AssetTable shortId={model._shortId} />
                  </div>
                </Col>
                <Col xs={12} md={4}>
                  <div className='info-card'>
                    <section className='image'>
                      <img src={model.image} className='img-responsive' />
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
              </Row>
            </Grid>
          </Row>
        </Grid>
      </div>
    )
  }
})

export default AssetModal
