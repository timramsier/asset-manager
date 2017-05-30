import React from 'react'
import FontAwesome from 'react-fontawesome'
import NavItem from './NavItem'
import axios from 'axios'
import AssetGrid from './AssetGrid'

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
      category: {},
      view: 'all'
    })
  },
  setView (view) {
    let newState = this.state
    Object.assign(newState, {view})
    this.setState(newState)
    this.updateAssetData()
    console.log(this.state)
  },
  updateAssetData () {
    let categoryData = () => {
      return new Promise((resolve, reject) => {
        const filterdData = this.props.categories.filter((search) => {
          return search.name === this.props.params.productType
        })
        let newState = this.state
        Object.assign(newState, {category: filterdData[0]})
        this.setState(newState)
        resolve(filterdData[0])
      })
    }
    let queryString
    let assetData = (categoryData) => {
      return new Promise((resolve, reject) => {
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
        if (categoryData) {
          axios.get(`
            http://localhost:3000/api/mock/assets/${categoryData.name}${queryString}`)
            .then((response) => {
              resolve(response.data)
            })
        }
      })
    }
    categoryData().then(assetData).then((result) => {
      if (result) {
        let newState = this.state
        Object.assign(newState, {models: result[0].models})
        this.setState(newState)
      }
    })
  },
  componentDidMount () {
    this.updateAssetData()
  },
  render () {
    const { productType } = this.props.params
    const locationPath = (
      <span className='location-path'>
        <a href='/'><FontAwesome className='fa-fw path-icon' name='home' /></a>
        {' '}/{' '}
        <a href={`/show/${productType}`}>{productType}</a>
      </span>
    )
    const { category } = this.state
    return (
      <div className='show-products'>
        <div className='content'>
          <div className='container-fluid'>
            <div className='row is-table-row'>
              <div className='col-sm-9 center'>
                <div className='container'>
                  <div className='row type-header'>
                    {locationPath}
                    <h1>{productType}</h1>
                    <nav className='product-nav'>
                      <ul>
                        <NavItem
                          setView={this.setView}
                          label='All'
                          active={this.state.view === 'all'}
                        />
                        <NavItem
                          setView={this.setView}
                          label='Active'
                          active={this.state.view === 'active'}
                        />
                        <NavItem
                          setView={this.setView}
                          label='Inactive'
                          active={this.state.view === 'inactive'}
                        />
                      </ul>
                    </nav>
                  </div>
                </div>
                <AssetGrid category={category} models={this.state.models} />
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
