import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Match } from 'react-router'
import axios from 'axios'
import Landing from './Landing'
import ShowProducts from './ShowProducts'
import LeftNavigation from './LeftNavigation'
import TopNavigation from './TopNavigation'
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
      axios.get('http://localhost:3000/api/mock/siteConfig').then((response) => {
        resolve(response)
      })
    })
    componentConfig.then((result) => {
      const { categories, menuOptions } = result.data.config
      const newState = this.state
      Object.assign(newState.categories, categories)
      Object.assign(newState.menuOptions, menuOptions)
      this.setState(newState)
    })
  },
  render () {
    const { categories, menuOptions, alertMessage } = this.state
    return (
      <BrowserRouter>
        <div className='app'>
          <TopNavigation />
          <LeftNavigation categories={categories} menuOptions={menuOptions} />
          <div className='main-content'>
            <Match exactly pattern='/' component={() => {
              return <Landing categories={categories} alertMessage={alertMessage} />
            }} />
            <Match pattern='/show/:productType'
              component={(props) => {
                return <ShowProducts categories={categories} {...props} />
              }} />
            {/* <Match pattern='/show/'
              component={(props) => {
                return <ShowProducts categories={categories} {...props} propTypes='all' />
              }} /> */}
          </div>
        </div>
      </BrowserRouter>
    )
  }
})

render(<App />, document.getElementById('app'))
