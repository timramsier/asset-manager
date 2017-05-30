import React from 'react'
import MenuButton from './MenuButton'

const { array } = React.PropTypes
const LeftNavigation = React.createClass({
  propTypes: {
    categories: array,
    menuOptions: array
  },
  render () {
    const { categories, menuOptions } = this.props
    return (
      <div className='navbar-side'>
        <nav className='nav'>
          <span className='menu-toggle'>
            <span className='line upper-line' />
            <span className='line lower-line' />
          </span>
          <ul className='nav-list'>
            <MenuButton bgColor='#666' linkTo='/show/' label='All' faIcon='home' />
            {categories.map((category) => {
              const {name, label, faIcon, color, api, id} = category
              return (
                <MenuButton key={`button_${id}`} bgColor={color} linkTo={`/${api}/${name}`} label={label} faIcon={faIcon} />
              )
            })}
            {menuOptions.map((option) => {
              const {name, label, faIcon, color, api, id} = option
              return (
                <MenuButton key={`button_${id}`} bgColor={color} linkTo={`/${api}/${name}`} label={label} faIcon={faIcon} />
              )
            })}
            <div className='button-terminate' />
          </ul>
        </nav>
      </div>
    )
  }
})

export default LeftNavigation
