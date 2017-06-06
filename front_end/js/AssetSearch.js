import React from 'react'
import { Row, FormGroup, FormControl, InputGroup, Grid, Col } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

const AssetSearch = React.createClass({
  getInitialState () {
    return {
      value: ''
    }
  },
  handleChange (e) {
    this.setState({ value: e.target.value })
    this.props.setSearchTerm(e.target.value)
  },
  render () {
    return (
      <Grid className='width-override'>
        <Row className='asset-search'>
          <Col xs={12}
            smOffset={6} sm={6}
            lgOffset={7} lg={5}
            className='search'>
            <form>
              <FormGroup
                controlId='formBasicText'
                >
                <InputGroup>
                  <FormControl
                    type='text'
                    value={this.state.value}
                    placeholder={`Search ${this.props.category}`}
                    onChange={this.handleChange} />
                  <InputGroup.Addon>
                    <FontAwesome name='search' />
                  </InputGroup.Addon>
                </InputGroup>
              </FormGroup>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }
})

export default AssetSearch
