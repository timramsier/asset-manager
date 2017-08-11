import React from 'react'
import FontAwesome from 'react-fontawesome'
import NavItem from './NavItem'
import ModelGrid from './ModelGrid'
import Search from './Search'
import { Row } from 'react-bootstrap'
import api from './api'

const { string, shape, array, bool, func } = React.PropTypes

const ShowModels = React.createClass({
  propTypes: {
    match: shape({
      params: shape({
        productType: string
      })
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
      view: 'active',
      headerAccentColor: 'rgb(102, 102, 102)',
      searchTerm: '',
      update: true,
      skip: 0,
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
  refreshData (data) {
    if (this._isMounted) {
      let newState = this.state
      Object.assign(newState, {models: data})
      this.setState(newState)
    }
  },
  pushData (data) {
    if (this._isMounted) {
      // disable updating if response array is smaller than limit
      let newState = this.state
      data.length < this.state.limit && (newState.update = false)
      newState.models.push.apply(newState.models, data)
      this.setState(newState)
    }
  },
  updateModelData (updateType = 'refresh') {
    let active
    let category = this.props.match.params.productType.toLowerCase()
    switch (this.state.view) {
      case 'active':
        active = true
        break
      case 'inactive':
        active = false
        break
      default:
        active = true
        break
    }
    let search
    if (this.state.searchTerm.length > 0) {
      search = encodeURIComponent(this.state.searchTerm)
    }
    api.getModels(category, {
      active,
      search,
      limit: this.state.limit,
      skip: this.state.skip
    })
      .then((response) => {
        if (updateType === 'refresh') {
          this.refreshData(response)
          this.updateHeaderAccentColor()
        } else if (updateType === 'push') {
          this.pushData(response)
        }
        this.state.loading = false
      })
  },
  updateHeaderAccentColor () {
    let color
    if (this.props.match.params.productType !== 'all') {
      color = this.props.categories.filter((category) => {
        return category.label === this.props.match.params.productType.toLowerCase()
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
  componentDidUpdate (prevProps) {
    if (this.props.match.params.productType !== prevProps.match.params.productType) {
      window.scrollTo(0, 0)
      this.state.limit = 12
      this.updateModelData('refresh')
      // this.props.closeMenu('admin')
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
      if (!this.state.loading && this.state.update) {
        let last = document.querySelectorAll('.asset').length - 1
        last < 0 && (last = 0)
        let elems = document.querySelectorAll('.asset-card')
        let lastElem = elems[last]
        var st = window.pageYOffset || document.documentElement.scrollTop
        if (st > lastScrollTop) {
          if (checkVisible(lastElem)) {
            this.state.skip += 12
            this.state.loading = true
            this.updateModelData('push')
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
    const { productType } = this.props.match.params
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
              <div className='center'>
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
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default ShowModels
