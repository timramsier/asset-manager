import React from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import AsyncLoad from './AsyncLoad';
import defaultLeftNavButtons from '../../config/defaultLeftNavButtons';
import TopNavigation from './TopNavigation';
import UnderDevelopment from './UnderDevelopment';
import apiSettings from '../../config/apiSettings';
import localConfig from '../../config/local.config';
import AdminOptions from './AdminOptions';
import api from '../api';
import '../../less/main.less';

if (global) {
  global.System = { import() {} };
}
const App = React.createClass({
  getInitialState() {
    return {
      categories: [],
      menuOptions: [],
      alertMessage: {
        type: 'danger',
        message: 'This page is currently under development',
      },
      modalOpen: false,
      user: {},
    };
  },
  toggleMenuOpen(menu) {
    document.querySelector('.navbar-side').classList.toggle(`${menu}-open`);
    document.querySelector('.main-content').classList.toggle(`${menu}-open`);
    document.querySelector('.admin-menu').classList.toggle(`${menu}-open`);
  },
  openMenu(menu) {
    setTimeout(() => {
      document.querySelector('.navbar-side').classList.add(`${menu}-open`);
    }, 400);
    document.querySelector('.main-content').classList.add(`${menu}-open`);
  },
  closeMenu(menu) {
    document.querySelector('.navbar-side').classList.remove(`${menu}-open`);
    setTimeout(() => {
      document.querySelector('.main-content').classList.remove(`${menu}-open`);
    }, 400);
  },
  checkLoginUser() {
    const { baseUrl, port } = localConfig;
    let url = baseUrl;
    if (port && port !== 80) {
      url += `:${port}`;
    }
    if (!this.authCheckId) {
      axios.get(`${url}/user`).then(response => {
        if (response.data && response.data.username) {
          const newState = this.state;
          Object.assign(newState, { user: response.data });
          this.setState(newState);
        } else {
          const newState = this.state;
          Object.assign(newState, { user: {} });
          this.setState(newState);
        }
      });
    }
  },
  componentDidMount() {
    if (!(apiSettings.auth && apiSettings.auth.username)) {
      console.warn(
        'Supply an API key to APP_DATABASE_API_KEY to connect to api'
      );
    }
    api.getCategories().then(categories => {
      const newState = this.state;
      Object.assign(newState.categories, categories);
      this.setState(newState);
    });
    this.checkLoginUser();
  },
  checkVisible(element) {
    const _posY = el => {
      let test = el;
      let top = 0;
      while (!!test && test.tagName.toLowerCase() !== 'body') {
        top += test.offsetTop;
        test = test.offsetParent;
      }
      return top;
    };
    const _viewPortHeight = () => {
      const de = document.documentElement;
      if (window.innerWidth) {
        return window.innerHeight;
      } else if (de && !isNaN(de.clientHeight)) {
        return de.clientHeight;
      }
      return 0;
    };
    const _scrollY = () => {
      if (window.pageYOffset) {
        return window.pageYOffset;
      }
      return Math.max(
        document.documentElement.scrollTop,
        document.body.scrollTop
      );
    };
    const vpH = _viewPortHeight(); // Viewport Height
    const st = _scrollY(); // Scroll Top
    const y = _posY(element); // element Y position
    return y < vpH + st;
  },
  render() {
    const { categories, alertMessage } = this.state;
    const { adminOptions } = defaultLeftNavButtons.buttons;
    if (this.state.user.username) {
      this.authCheckId = setInterval(this.checkLoginUser, 1 * 1 * 60 * 1000);
    } else {
      clearInterval(this.authCheckId);
    }
    return (
      <div className="app">
        <TopNavigation
          toggleMenuOpen={this.toggleMenuOpen}
          closeMenu={this.closeMenu}
          openMenu={this.openMenu}
          user={this.state.user}
        />
        <AsyncLoad
          loadingView={() => (
            <div
              style={{
                boxShadow: '1px 0 1px 0 hsla(0,0%,64%,.4)',
                background: '#2e3137',
                width: '100%',
                height: '100vh',
              }}
            />
          )}
          props={{
            categories,
            menuOptions: adminOptions,
            toggleMenuOpen: this.toggleMenuOpen,
            closeMenu: this.closeMenu,
          }}
          loadingPromise={System.import('./LeftNavigation')}
        />
        <div className="main-content">
          <Route
            exact
            path="/"
            component={props => (
              <AsyncLoad
                props={Object.assign(
                  {
                    categories,
                    alertMessage,
                  },
                  props
                )}
                loadingPromise={System.import('./Landing')}
              />
            )}
          />
          <Route
            path="/login"
            component={props => (
              <AsyncLoad
                props={Object.assign(
                  {
                    user: this.state.user,
                  },
                  props
                )}
                setLoginUser={this.setLoginUser}
                loadingPromise={System.import('./Login')}
              />
            )}
          />
          <Route
            path="/show/:productType"
            component={props => (
              <AsyncLoad
                props={Object.assign(
                  {
                    categories,
                    api,
                    assetModal: this.state.assetModal,
                    checkVisible: this.checkVisible,
                  },
                  props
                )}
                loadingPromise={System.import('./ShowModels')}
              />
            )}
          />
          <Route path="/admin/:page" component={() => <UnderDevelopment />} />
        </div>
        {this.state.user &&
          this.state.user.accessLevel === 'Admin' && (
            <AdminOptions
              user={this.state.user}
              toggleMenuOpen={this.toggleMenuOpen}
              closeMenu={this.closeMenu}
              openMenu={this.openMenu}
            />
          )}
      </div>
    );
  },
});

export default App;
