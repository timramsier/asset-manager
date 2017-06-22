import React from 'react'
import LandingSearch from './LandingSearch'
import LandingCard from './LandingCard'
import PageAlert from './PageAlert'
const { shape, string, arrayOf } = React.PropTypes

const Landing = React.createClass({
  propTypes: {
    alertMessage: shape({
      title: string,
      message: string,
      type: string
    }),
    categories: arrayOf(shape({
      name: string,
      label: string,
      faIcon: string,
      color: string,
      api: string
    })),
    searchTerm: string
  },
  handleChange (e) {
    this.setState({ searchTerm: e.target.value })
  },
  searchAll (event) {
    console.log('not working yet')
  },
  render () {
    let alertMessage
    if (this.props.alertMessage) {
      alertMessage = (
        <PageAlert title={this.props.alertMessage.title}
          message={this.props.alertMessage.message}
          type={this.props.alertMessage.type} />
      )
    }
    return (
      <div className='landing'>
        <div className='content'>
          {alertMessage}
          <div className='hero-section'>
            <div className='hero-content'>
              <h1>Search for what you need here.</h1>
              <p>You can search for users, hardware, or software</p>
              <LandingSearch />
            </div>
          </div>
          <div className='row'>
            <div className='categories'>
              {this.props.categories.map((category) => <LandingCard
                key={`categorycard_${category.name}`}
                category={category} />)}
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default Landing
