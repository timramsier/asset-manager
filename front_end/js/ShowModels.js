import React from 'react'
import FontAwesome from 'react-fontawesome'
import NavItem from './NavItem'
import axios from 'axios'
import ModelGrid from './ModelGrid'
import AdminOptions from './AdminOptions'
import Search from './Search'
import apiSettings from '../config/apiSettings'
import { Row } from 'react-bootstrap'

const { string, shape, array, bool, func } = React.PropTypes

const ShowModels = React.createClass({
  propTypes: {
    params: shape({
      productType: string
    }),
    checkVisible: func,
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
    }),
    location: shape({
      query: shape({
        search: string
      })
    })
  },
  getInitialState () {
    return ({
      models: [],
      view: 'all',
      headerAccentColor: 'rgb(102, 102, 102)',
      searchTerm: '',
      limit: 12,
      loading: true
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
    let pre = `?limit=${this.state.limit}`
    if (this.state.searchTerm.length > 0) {
      searchString = `&search=${encodeURIComponent(this.state.searchTerm)}`
    }
    let url = `http://${apiSettings.uri}/models/${category}${pre}${queryString}${searchString}`
    axios.get(url, {auth: apiSettings.auth})
      .then((response) => {
        this.updateModels(response.data)
        this.updateHeaderAccentColor()
        this.state.loading = false
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
  componentDidUpdate (prevProps) {
    if (this.props.params.productType !== prevProps.params.productType) {
      window.scrollTo(0, 0)
      this.state.limit = 12
      this.updateModelData()
    }
  },
  componentDidMount () {
    window.scrollTo(0, 0)
    const checkVisible = this.props.checkVisible
    let lastScrollTop = 0
    this._isMounted = true
    if (this.props.location.query && this.props.location.query.search) {
      this.setSearchTerm(this.props.location.query.search)
    } else {
      this.setSearchTerm('')
    }
    window.addEventListener('scroll', (event) => {
      if (!this.state.loading) {
        let last = document.querySelectorAll('.asset').length - 1
        last < 0 ? last = 0 : undefined
        let elems = document.querySelectorAll('.asset-card')
        let lastElem = elems[last]
        var st = window.pageYOffset || document.documentElement.scrollTop
        if (st > lastScrollTop) {
          if (checkVisible(lastElem)) {
            this.state.limit += 12
            this.state.loading = true
            this.updateModelData()
          }
        }
        lastScrollTop = st
      }
    })
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
                <Row className='asset-search width-override'>
                  <Search
                    searchType={categoryName}
                    setSearchTerm={this.setSearchTerm}
                    searchTerm={this.state.searchTerm}
                    xs={12} sm={6} md={5}
                   />
                </Row>
                <ModelGrid
                  models={this.state.models}
                  assetModal={this.props.assetModal}
                />
              </div>
              <div className='col-sm-3 side-bar'>
                <AdminOptions />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default ShowModels
