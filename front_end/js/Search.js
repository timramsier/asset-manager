import React from 'react'
import { FormGroup, FormControl, InputGroup, Col, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

const { func, string, number } = React.PropTypes

const ModelSearch = React.createClass({
  propTypes: {
    setSearchTerm: func,
    category: string,
    xs: number,
    sm: number,
    md: number,
    lg: number
  },
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
    let { xs, sm, md, lg } = this.props
    let colProps = {xs, sm, md, lg}
    return (
      <Col className='search' {...colProps}>
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
    )
  }
})

export default ModelSearch
