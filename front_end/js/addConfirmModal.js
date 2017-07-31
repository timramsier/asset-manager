import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

const { string, func } = React.PropTypes

const addConfirmModal = (WrappedComponent) => {
  return React.createClass({
    propTypes: {
      header: string,
      body: string,
      onCancel: func,
      onConfirm: func
    },
    getInitialState () {
      return ({
        showModal: false,
        header: 'Confirm',
        body: 'No body provided',
        onConfirm: () => console.warn('Please provide onConfirm action'),
        onCancel: null
      })
    },
    closeConfirmModal () {
      let newState = this.state
      Object.assign(newState, { showModal: false })
      this.setState(newState)
    },
    openConfirmModal (props) {
      let newState = this.state
      let { header, body, onCancel, onConfirm } = this.state
      if (props) {
        header = props.header || this.state.header
        body = props.body || this.state.body
        onCancel = props.onCancel || this.state.onCancel
        onConfirm = props.onConfirm || this.state.onConfirm
      }
      Object.assign(newState,
        {
          showModal: true,
          header,
          body,
          onConfirm,
          onCancel
        }
      )
      this.setState(newState)
    },
    render () {
      return (
        <div className='confirmModal-wrapped-component'>
          <WrappedComponent
            openConfirmModal={this.openConfirmModal}
            closeConfirmModal={this.closeConfirmModal}
            {...this.props}
          />
          <Modal show={this.state.showModal} onHide={this.close}
            className='center-on-screen confirm-modal'>
            <Modal.Header>
              {this.state.header}
            </Modal.Header>
            <Modal.Body>
              {this.state.body}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => {
                if (this.state.onConfirm instanceof Function) {
                  this.state.onConfirm()
                }
                this.closeConfirmModal()
              }}>
                <FontAwesome className='fa-fw' name='check' />Okay
              </Button>
              <Button onClick={() => {
                if (this.state.onCancel instanceof Function) {
                  this.state.onCancel()
                }
                this.closeConfirmModal()
              }}>
                <FontAwesome className='fa-fw' name='times' />Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )
    }
  })
}

export default addConfirmModal
