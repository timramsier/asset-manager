import React from 'react'
import { Route } from 'react-router-dom'
import AsyncLoad from './AsyncLoad'
import defaultLeftNavButtons from '../config/defaultLeftNavButtons'
import TopNavigation from './TopNavigation'
import UnderDevelopment from './UnderDevelopment'
import apiSettings from '../config/apiSettings'
import AdminOptions from './AdminOptions'
import api from './api'
import '../public/less/main.less'

if (global) {
  global.System = { import () {} }
}

const App = React.createClass({
  getInitialState () {
    return ({
      categories: [],
      menuOptions: [],
      alertMessage: {
        type: 'danger',
        message: 'This page is currently under development'
      },
      modalOpen: false
    })
  },
  toggleMenuOpen (menu) {
    document.querySelector('.navbar-side').classList.toggle(`${menu}-open`)
    document.querySelector('.main-content').classList.toggle(`${menu}-open`)
    document.querySelector('.admin-menu').classList.toggle(`${menu}-open`)
  },
  openMenu (menu) {
    setTimeout(() => {
      document.querySelector('.navbar-side').classList.add(`${menu}-open`)
    }, 400)
    document.querySelector('.main-content').classList.add(`${menu}-open`)
  },
  closeMenu (menu) {
    document.querySelector('.navbar-side').classList.remove(`${menu}-open`)
    setTimeout(() => {
      document.querySelector('.main-content').classList.remove(`${menu}-open`)
    }, 400)
  },
  componentDidMount () {
    if (!(apiSettings.auth && apiSettings.auth.username)) {
      console.warn('Supply an API key to APP_DATABASE_API_KEY to connect to api')
    }
    api.getCategories().then((categories) => {
      const newState = this.state
      Object.assign(newState.categories, categories)
      this.setState(newState)
    })
  },
  checkVisible (element) {
    let _posY = (element) => {
      var test = element
      var top = 0
      while (!!test && test.tagName.toLowerCase() !== 'body') {
        top += test.offsetTop
        test = test.offsetParent
      }
      return top
    }
    let _viewPortHeight = () => {
      var de = document.documentElement
      if (window.innerWidth) {
        return window.innerHeight
      } else if (de && !isNaN(de.clientHeight)) {
        return de.clientHeight
      }
      return 0
    }
    let _scrollY = () => {
      if (window.pageYOffset) { return window.pageYOffset }
      return Math.max(document.documentElement.scrollTop, document.body.scrollTop)
    }
    var vpH = _viewPortHeight() // Viewport Height
    var st = _scrollY() // Scroll Top
    var y = _posY(element) // element Y position
    return (y < (vpH + st))
  },
  render () {
    const { categories, alertMessage } = this.state
    const { adminOptions } = defaultLeftNavButtons.buttons
    return (
      <div className='app'>
        <TopNavigation
          toggleMenuOpen={this.toggleMenuOpen}
          closeMenu={this.closeMenu}
          openMenu={this.openMenu}
        />
        <AsyncLoad
          loadingView={() => {
            return (
              <div style={{
                boxShadow: '1px 0 1px 0 hsla(0,0%,64%,.4)',
                background: '#2e3137',
                width: '100%',
                height: '100vh'
              }} />
            )
          }}
          props={{
            categories: categories,
            menuOptions: adminOptions,
            toggleMenuOpen: this.toggleMenuOpen,
            closeMenu: this.closeMenu
          }}
          loadingPromise={System.import('./LeftNavigation')}
        />
        <div className='main-content'>
          <Route
            exact path='/'
            component={(props) => <AsyncLoad
              props={Object.assign({
                categories,
                alertMessage
              }, props)}
              loadingPromise={System.import('./Landing')}
            />}
          />
          <Route
            path='/show/:productType'
            component={(props) => <AsyncLoad
              props={Object.assign({
                categories,
                api,
                assetModal: this.state.assetModal,
                checkVisible: this.checkVisible
              }, props)}
              loadingPromise={System.import('./ShowModels')}
            />}
          />
          {/* Temporary Route */}
          <Route path='/admin/:page'
            component={() => <UnderDevelopment />}
          />
        </div>
        <AdminOptions
          toggleMenuOpen={this.toggleMenuOpen}
          closeMenu={this.closeMenu}
          openMenu={this.openMenu}
        />
      </div>
    )
  }
})

export default App
