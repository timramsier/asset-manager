import React from 'react'
import { Row, FormGroup, FormControl, InputGroup, Grid, Col, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

const ModelSearch = React.createClass({
  getInitialState () {
    return {
      value: ''
    }
  },
  handleChange (e) {
    this.setState({ value: e.target.value })
  },
  render () {
    const clickEffect = {
      onClick: () => {
        this.setState({value: ''})
        this.props.setSearchTerm('')
      }
    }
    return (
      <Grid className='width-override'>
        <Row className='asset-search'>
          <Col xs={12}
            smOffset={6} sm={6}
            lgOffset={7} lg={5}
            className='search'>
            <form onSubmit={(event) => {
              event.preventDefault()
              this.props.setSearchTerm(this.state.value)
            }}>
              <FormGroup
                controlId='formBasicText'
                >
                <InputGroup>
                  <FormControl
                    type='text'
                    value={this.state.value}
                    placeholder={`Search ${this.props.category}`}
                    onChange={this.handleChange} />
                  <InputGroup.Button>
                    <Button {...clickEffect}><FontAwesome name='times' /></Button>
                  </InputGroup.Button>
                  <InputGroup.Button>
                    <Button type='submit'><FontAwesome name='search' /></Button>
                  </InputGroup.Button>
                </InputGroup>
              </FormGroup>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }
})

export default ModelSearch
