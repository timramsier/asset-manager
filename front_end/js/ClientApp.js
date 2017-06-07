import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Match } from 'react-router'
import axios from 'axios'
import Landing from './Landing'
import ShowProducts from './ShowProducts'
import LeftNavigation from './LeftNavigation'
import defaultLeftNavButtons from '../config/defaultLeftNavButtons'
import TopNavigation from './TopNavigation'
import apiSettings from '../config/apiSettings'
import '../public/less/main.less'

const App = React.createClass({
  getInitialState () {
    return ({
      categories: [],
      menuOptions: [],
      alertMessage: {
        type: 'danger',
        message: 'This page is currently under development'
      }
    })
  },
  componentDidMount () {
    let componentConfig = new Promise((resolve, reject) => {
      let url = `http://@localhost:3000/api/alpha/category`
      axios.get(url, apiSettings.auth).then((response) => {
        resolve(response)
      })
    })
    componentConfig.then((result) => {
      const categories = result.data
      const newState = this.state
      Object.assign(newState.categories, categories)
      this.setState(newState)
    })
  },
  render () {
    const { categories, alertMessage } = this.state
    const { adminOptions } = defaultLeftNavButtons.buttons
    return (
      <BrowserRouter>
        <div className='app'>
          <TopNavigation />
          <LeftNavigation categories={categories} menuOptions={adminOptions} />
          <div className='main-content'>
            <Match exactly pattern='/' component={() => {
              return <Landing categories={categories} alertMessage={alertMessage} />
            }} />
            <Match pattern='/show/:productType'
              component={(props) => {
                return <ShowProducts categories={categories} {...props} />
              }} />
          </div>
        </div>
      </BrowserRouter>
    )
  }
})

render(<App />, document.getElementById('app'))
