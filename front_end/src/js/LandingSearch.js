import React from 'react'
import { Redirect } from 'react-router'
import { FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

const LandingSearch = React.createClass({
  getInitialState () {
    return {
      value: '',
      searchTerm: ''
    }
  },
  handleChange (event) {
    this.setState({ value: event.target.value })
  },
  setSearchTerm (searchTerm) {
    let newState = this.state
    Object.assign(newState, {searchTerm})
    this.setState(newState)
  },
  searchAll (event) {
    event.preventDefault()
    this.setSearchTerm(this.state.value)
  },
  render () {
    let redirectComponent
    if (this.state.searchTerm.length > 0) {
      let searchTerm = this.state.searchTerm
      redirectComponent = <Redirect to={{
        pathname: '/show/all',
        search: `?search=${encodeURIComponent(searchTerm)}`
      }} />
    }
    return (
      <form className='hero-search' onSubmit={this.searchAll}>
        {redirectComponent}
        <FormGroup>
          <InputGroup>
            <FormControl
              type='text'
              value={this.state.value}
              placeholder={`Search All Categories`}
              onChange={this.handleChange} />
            <InputGroup.Button>
              <Button type='submit' title='Search'><FontAwesome name='search' /></Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </form>
    )
  }
})

export default LandingSearch
