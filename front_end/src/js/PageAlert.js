import React from 'react'
import { Alert } from 'react-bootstrap'

const { string } = React.PropTypes

const PageAlert = React.createClass({
  propTypes: {
    title: string,
    message: string,
    type: string
  },
  getInitialState () {
    return {
      alertVisible: true
    }
  },
  handleAlertDismiss () {
    this.setState({alertVisible: false})
  },
  handleAlertShow () {
    this.setState({alertVisible: true})
  },
  render () {
    let title,
      message
    if (this.props.title) { title = <h4>{this.props.title}</h4> }
    if (this.props.message) { message = <p>{this.props.message}</p> }
    if (this.state.alertVisible) {
      return (
        <Alert bsStyle={this.props.type} onDismiss={this.handleAlertDismiss} className='top-notification'>
          {title}
          {message}
        </Alert>
      )
    }
    return (
      <span className='no-alert' />
    )
  }
})

export default PageAlert
