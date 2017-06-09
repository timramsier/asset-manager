import React from 'react'
import FontAwesome from 'react-fontawesome'
import NavItem from './NavItem'
import axios from 'axios'
import ModelGrid from './ModelGrid'
import ModelSearch from './ModelSearch'
import apiSettings from '../config/apiSettings'

const { string, shape, array, bool } = React.PropTypes

const ShowModels = React.createClass({
  propTypes: {
    params: shape({
      productType: string
    }),
    categories: array,
    assetModal: shape({
      open: bool,
      data: shape({
        _id: string,
        vendor: string,
        name: string,
        version: string,
        image: string,
        description: string,
        assets: array
      })
    })
  },
  getInitialState () {
    return ({
      models: [],
      view: 'all',
      headerAccentColor: 'rgb(102, 102, 102)',
      searchTerm: ''
    })
  },
  setSearchTerm (searchTerm) {
    let newState = this.state
    Object.assign(newState, {searchTerm})
    this.setState(newState)
    this.updateModelData()
  },
  setView (view) {
    let newState = this.state
    Object.assign(newState, {view})
    this.setState(newState)
    this.updateModelData()
  },
  updateModelData () {
    let queryString
    let category = this.props.params.productType.toLowerCase()

    switch (this.state.view) {
      case 'active':
        queryString = `?active=true`
        break
      case 'inactive':
        queryString = `?active=false`
        break
      default:
        queryString = ''
        break
    }
    let searchString = ''
    if (this.state.searchTerm.length > 0) {
      let pre
      if (queryString.length > 0) {
        pre = '&'
      } else {
        pre = '?'
      }
      searchString = `${pre}search=${encodeURIComponent(this.state.searchTerm)}`
    }
    let url = `http://${apiSettings.uri}/models/${category}${queryString}${searchString}`
    axios.get(url, {auth: apiSettings.auth})
      .then((response) => {
        this.updateModels(response.data)
        this.updateHeaderAccentColor()
      })
  },
  updateHeaderAccentColor () {
    let color
    if (this.props.params.productType !== 'all') {
      color = this.props.categories.filter((category) => {
        return category.label === this.props.params.productType.toLowerCase()
      })[0].config.color
    } else {
      color = 'rgb(102, 102, 102)'
    }
    if (this._isMounted) {
      let newState = this.state
      Object.assign(newState, {headerAccentColor: color})
      this.setState(newState)
    }
  },
  updateModels (models) {
    if (this._isMounted) {
      let newState = this.state
      Object.assign(newState, {models: models})
      this.setState(newState)
    }
  },
  componentDidMount () {
    this._isMounted = true
    this.updateModelData()
  },
  componentWillUnmount () {
    this._isMounted = false
  },
  render () {
    const { productType } = this.props.params
    const categoryName = productType[0].toUpperCase() + productType.slice(1)
    const locationPath = (
      <span className='location-path'>
        <a href='/'><FontAwesome className='fa-fw path-icon' name='home' /></a>
        {' '}/{' '}
        <a href={`/show/${productType}`}>{categoryName}</a>
      </span>
    )
    return (
      <div className='show-models'>
        <div className='content'>
          <div className='container-fluid'>
            <div className='row is-table-row'>
              <div className='col-sm-9 center'>
                <div className='container width-override'>
                  <div className='row type-header'
                    style={{borderColor: this.state.headerAccentColor}}>
                    {locationPath}
                    <h1>{categoryName}</h1>
                    <nav className='product-nav'>
                      <ul>
                        <NavItem
                          setView={this.setView}
                          label='All'
                          active={this.state.view === 'all'}
                          highlightColor={this.state.headerAccentColor}
                        />
                        <NavItem
                          setView={this.setView}
                          label='Active'
                          active={this.state.view === 'active'}
                          highlightColor={this.state.headerAccentColor}
                        />
                        <NavItem
                          setView={this.setView}
                          label='Inactive'
                          active={this.state.view === 'inactive'}
                          highlightColor={this.state.headerAccentColor}
                        />
                      </ul>
                    </nav>
                  </div>
                </div>
                <ModelSearch category={categoryName}
                  setSearchTerm={this.setSearchTerm} />
                <ModelGrid
                  models={this.state.models}
                  assetModal={this.props.assetModal}
                />
              </div>
              <div className='col-sm-3 side-bar'>
                column
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default ShowModels
