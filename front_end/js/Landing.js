import React from 'react'
import { FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
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
    }))
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
              <form className='hero-search'>
                <FormGroup>
                  <InputGroup>
                    <FormControl type='text' placeholder='Enter search here' />
                    <InputGroup.Addon>
                      <FontAwesome name='search' />
                    </InputGroup.Addon>
                  </InputGroup>
                </FormGroup>
              </form>
            </div>
          </div>
          <div className='row'>
            <div className='container'>
              <div className='categories'>
                {this.props.categories.map((category) => {
                  return (
                    <div key={`categorycard_${category.name}`} className='category col-sm-6 col-md-3'>
                      <div className='category-card' style={{
                        borderColor: category.color,
                        color: category.color
                      }}>
                        <section className='icon'>
                          <FontAwesome name={category.faIcon} />
                        </section>
                        <section className='title'>
                          <h2>{category.name}</h2>
                        </section>
                        <section className='description'>
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                          sed do eiusmod tempor incididunt ut labore et dolore magna
                          aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                        </section>
                        <section className='actions'>
                          <Button>Take a look</Button>
                        </section>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default Landing
