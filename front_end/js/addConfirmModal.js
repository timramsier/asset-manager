import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

const { string, func, object, oneOfType, bool } = React.PropTypes

const defaultState = {
  showModal: false,
  header: 'Confirm',
  body: 'No body provided',
  onConfirm: '',
  onCancel: null,
  noCancel: false,
  modalType: ''
}

const addConfirmModal = (WrappedComponent) => {
  return React.createClass({
    propTypes: {
      modalType: string,
      header: string,
      body: oneOfType([string, func, object]),
      onCancel: func,
      onConfirm: func,
      noCancel: bool
    },
    getInitialState () {
      return (JSON.parse(JSON.stringify(defaultState)))
    },
    closeConfirmModal () {
      this.setState(defaultState)
    },
    openConfirmModal (props) {
      let newState = this.state
      let { header, body, onCancel, onConfirm, modalType, noCancel } = this.state
      if (props) {
        header = props.header || header
        body = props.body || body
        onCancel = props.onCancel || onCancel
        onConfirm = props.onConfirm || onConfirm
        noCancel = props.noCancel || noCancel
        modalType = props.modalType || modalType
      }
      Object.assign(newState,
        {
          showModal: true,
          header,
          body,
          onConfirm,
          onCancel,
          noCancel,
          modalType
        }
      )
      this.setState(newState)
    },
    render () {
      let cancel
      if (!this.state.noCancel) {
        cancel =
          <Button onClick={() => {
            if (this.state.onCancel instanceof Function) {
              this.state.onCancel()
            }
            this.closeConfirmModal()
          }}>
            <FontAwesome className='fa-fw' name='times' />Cancel
          </Button>
      }

      const modalType = {
        success: {
          color: '#3c763d',
          background: '#dff0d8'
        },
        info: {
          color: '#31708f',
          background: '#d9edf7'
        },
        warning: {
          color: '#8a6d3b',
          background: '#fcf8e3'
        },
        danger: {
          color: '#a94442',
          background: '#f2dede'
        }
      }

      let style
      this.state.modalType && (style = modalType[this.state.modalType])
      return (
        <div className='confirmModal-wrapped-component'>
          <WrappedComponent
            openConfirmModal={this.openConfirmModal}
            closeConfirmModal={this.closeConfirmModal}
            {...this.props}
          />
          <Modal show={this.state.showModal} onHide={this.close}
            className='center-on-screen confirm-modal'>
            <Modal.Header style={style}>
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
              {cancel}
            </Modal.Footer>
          </Modal>
        </div>
      )
    }
  })
}

export default addConfirmModal
