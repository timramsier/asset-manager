import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Match } from 'react-router'
import axios from 'axios'
import { VelocityTransitionGroup } from 'velocity-react'
import Landing from './Landing'
import ShowModels from './ShowModels'
import LeftNavigation from './LeftNavigation'
import defaultLeftNavButtons from '../config/defaultLeftNavButtons'
import TopNavigation from './TopNavigation'
import AdminOptions from './AdminOptions'
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
      modalOpen: false,
      menu: {
        leftOpen: false,
        rightOpen: false
      }
    })
  },
  setMenuState (menuState) {
    let newState = this.state
    Object.assign(newState, {menu: menuState})
    this.setState(newState)
  },
  toggleMenuOpen (side) {
    document.querySelector('.main-content').classList.toggle(`${side}-open`)
    let newState = this.state
    newState.menu[`${side}Open`] = !newState.menu[`${side}Open`]
    this.setState(newState)
  },
  componentDidMount () {
    let componentConfig = new Promise((resolve, reject) => {
      let url = `http://${apiSettings.uri}/categories`
      axios.get(url, {auth: apiSettings.auth}).then((response) => {
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
    const adminOptionsAnimationProps = {
      runOnMount: true,
      enter: {
        animation: {
          right: 0,
          opacity: 1.0
        },
        easing: [0.495, 0, 0.510, 0.995],
        duration: 400
      },
      leave: {
        animation: {
          right: -300,
          opacity: 0.0
        },
        easing: [0.495, 0, 0.510, 0.995],
        duration: 400
      }
    }
    return (
      <BrowserRouter>
        <div className='app'>
          <TopNavigation toggleMenuOpen={this.toggleMenuOpen} />
          <LeftNavigation categories={categories}
            menuOptions={adminOptions}
            toggleMenuOpen={this.toggleMenuOpen}
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
          <VelocityTransitionGroup {...adminOptionsAnimationProps}>
            {this.state.menu.rightOpen ? <AdminOptions /> : undefined}
          </VelocityTransitionGroup>
        </div>
      </BrowserRouter>
    )
  }
})

render(<App key='main_app_component' />, document.getElementById('app'))
