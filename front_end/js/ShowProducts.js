import React from 'react'
import FontAwesome from 'react-fontawesome'
import NavItem from './NavItem'
import axios from 'axios'
import AssetGrid from './AssetGrid'
import AssetSearch from './AssetSearch'

const { string, shape, array } = React.PropTypes

const ShowProducts = React.createClass({
  propTypes: {
    params: shape({
      productType: string
    }),
    categories: array
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
    // this.updateAssetData()
  },
  setView (view) {
    let newState = this.state
    Object.assign(newState, {view})
    this.setState(newState)
    this.updateAssetData()
  },
  updateAssetData () {
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

    let url = `http://localhost:3000/api/alpha/assets/${category}${queryString}`

    axios.get(url)
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
    this.updateAssetData()
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
      <div className='show-products'>
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
                <AssetSearch category={categoryName}
                  setSearchTerm={this.setSearchTerm} />
                <AssetGrid models={this.state.models} />
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

export default ShowProducts
