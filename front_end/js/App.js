import React from 'react'
import { Match } from 'react-router'
import axios from 'axios'
import Landing from './Landing'
import ShowModels from './ShowModels'
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
      },
      modalOpen: false
    })
  },
  toggleMenuOpen (menu) {
    document.querySelector('.navbar-side').classList.toggle(`${menu}-open`)
    document.querySelector('.main-content').classList.toggle(`${menu}-open`)
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

    console.log('DEBUG:', apiSettings)

    let componentConfig = new Promise((resolve, reject) => {
      let url = `http://${apiSettings.uri}/categories`
      axios.get(url, {auth: apiSettings.auth})
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          console.error(error)
          reject(error)
        })
    })
    componentConfig.then((result) => {
      const categories = result.data
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
        <LeftNavigation categories={categories}
          menuOptions={adminOptions}
          toggleMenuOpen={this.toggleMenuOpen}
          closeMenu={this.closeMenu}
        />
        <div className='main-content'>
          <Match exactly pattern='/' component={() => {
            return <Landing categories={categories}
              alertMessage={alertMessage} />
          }} />
          <Match pattern='/show/:productType'
            component={(props) => {
              return <ShowModels categories={categories}
                assetModal={this.state.assetModal}
                checkVisible={this.checkVisible}
                {...props} />
            }} />
        </div>
      </div>
    )
  }
})

export default App
