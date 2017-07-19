import React from 'react'

const { object, func } = React.PropTypes

const AsyncLoad = React.createClass({
  propTypes: {
    props: object,
    loadingPromise: object,
    loadingView: func
  },
  getInitialState () {
    return ({
      loaded: false
    })
  },
  componentDidMount () {
    this.props.loadingPromise.then((module) => {
      this.component = module.default
      this.setState({loaded: true})
    })
  },
  render () {
    let LoadingView = () => (
      <div className='center'>
        <div className='loading'>
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    )
    if (this.props.loadingView) {
      LoadingView = this.props.loadingView
    }
    if (this.state.loaded) {
      return <this.component {...this.props.props} />
    } else {
      return (
        <LoadingView />
      )
    }
  }
})

export default AsyncLoad
