import React from 'react'
import FontAwesome from 'react-fontawesome'
import { Link } from 'react-router-dom'
import ReactResizeDetector from 'react-resize-detector'
import { setGridProps } from './common'

const { string, shape } = React.PropTypes

const LandingCard = React.createClass({
  propTypes: {
    category: shape({
      _id: string,
      name: string,
      description: string,
      label: string,
      config: shape({
        faIcon: string,
        color: string,
        api: string,
        fallbackImage: string
      }),
      _shortId: string
    }),
    width: string
  },
  getInitialState () {
    return ({
      cssProps: {
        width: this.props.width || '25%'
      }
    })
  },
  componentDidMount () {
    this._isMounted = true
    setGridProps(this)
    window.addEventListener('resize', (event) => {
      setGridProps(this)
    })
  },
  componentWillUnmount () {
    this._isMounted = false
  },
  render () {
    const { category } = this.props
    return (
      <div className='category' style={this.state.cssProps}>
        <div className='category-card' style={{
          borderColor: category.config.color,
          color: category.config.color
        }}>
          <section className='icon'>
            <FontAwesome name={category.config.faIcon} />
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
            <Link className='btn btn-default' to={`/show/${category.name}`}>Take a look</Link>
          </section>
        </div>
        <ReactResizeDetector handleWidth handleHeight onResize={() => setGridProps(this)} />
      </div>
    )
  }
})

export default LandingCard
