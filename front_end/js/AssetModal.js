import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

const AssetModal = React.createClass({
  render () {
    return (
      <div className='asset-modal' style={{backgroundColor: this.props.bgColor}}>
        <Grid>
          <Row>
            <Col xs={8} xsOffset={2}>
              <div className='asset-card'>
                <h1>Test</h1>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
})

export default AssetModal
