import React from 'react'
import { VelocityComponent } from 'velocity-react'
import MenuButton from './MenuButton'
import ExpandButton from './ExpandButton'
const { array } = React.PropTypes
const LeftNavigation = React.createClass({
  propTypes: {
    categories: array,
    menuOptions: array
  },
  getInitialState () {
    return ({
      expanded: false
    })
  },
  toggleMenu () {
    this.setState({expanded: !this.state.expanded})
  },
  render () {
    let animationProps
    if (this.state.expanded) {
      animationProps = {
        animation: {
          width: 200
        },
        duration: 400
      }
    } else {
      animationProps = {
        animation: {
          width: 50
        },
        duration: 400
      }
    }
    const { categories, menuOptions } = this.props
    return (
      <VelocityComponent {...animationProps}>
        <div className='navbar-side' >
          <nav className='nav'>
            <ExpandButton toggleMenu={this.toggleMenu} expanded={this.state.expanded} />
            <ul className='nav-list'>
              <MenuButton bgColor='#666' linkTo='/show/all' label='All'
                name='All' faIcon='home' expanded={this.state.expanded} />
              {categories.map((category) => {
                const {name, label, _id} = category
                const {color, faIcon, api} = category.config
                return (
                  <MenuButton key={`button_${_id}`} bgColor={color}
                    linkTo={`/${api}/${name}`}
                    name={name}
                    label={label}
                    faIcon={faIcon}
                    expanded={this.state.expanded} />
                )
              })}
              {menuOptions.map((option) => {
                const {name, label, faIcon, color, api, id} = option
                return (
                  <MenuButton key={`button_${id}`} bgColor={color}
                    linkTo={`/${api}/${name}`}
                    name={name}
                    label={label}
                    faIcon={faIcon}
                    expanded={this.state.expanded} />
                )
              })}
              <div className='button-terminate' />
            </ul>
          </nav>
        </div>
      </VelocityComponent>
    )
  }
})

export default LeftNavigation
