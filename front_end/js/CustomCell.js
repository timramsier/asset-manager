import React from 'react'
import { Cell } from 'fixed-data-table'
import { Modal, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import axios from 'axios'
import apiSettings from '../config/apiSettings'

const { string, number, array, func, object } = React.PropTypes

const propValidation = {
  data: array,
  rowIndex: number,
  col: string,
  subCol: string,
  height: number,
  width: number,
  apiCall: string,
  getData: func,
  flashMessage: func,
  setAdminModal: func,
  component: object
}

const DateCell = React.createClass({
  propTypes: propValidation,
  render () {
    const { data, rowIndex, col, subCol, height, width } = this.props
    let dimensons = { height, width }
    let cellData = ''
    if (data[rowIndex][col]) {
      cellData = data[rowIndex][col]
      if (subCol && data[rowIndex][col][subCol]) {
        cellData = data[rowIndex][col][subCol]
      }
    }
    let date = new Date(cellData)
    let formattedDate = date.toLocaleString()
    return (
      <Cell {...dimensons}>
        {formattedDate}
      </Cell>
    )
  }
})

const TextCell = React.createClass({
  propTypes: propValidation,
  render () {
    const { data, rowIndex, col, subCol, height, width } = this.props
    let cellData = ''
    if (data[rowIndex][col]) {
      cellData = data[rowIndex][col]
      if (subCol && data[rowIndex][col][subCol]) {
        cellData = data[rowIndex][col][subCol]
      }
    }
    let dimensons = { height, width }
    return (
      <Cell {...dimensons}>
        {cellData}
      </Cell>
    )
  }
})

const ModalCell = React.createClass({
  propTypes: propValidation,
  render () {
    const { data, rowIndex, col, subCol, height, width } = this.props
    let cellData = ''
    if (data[rowIndex][col]) {
      cellData = data[rowIndex][col]
      if (subCol && data[rowIndex][col][subCol]) {
        cellData = data[rowIndex][col][subCol]
      }
    }
    let dimensons = { height, width }
    return (
      <Cell {...dimensons}>
        <a className='cell-link'>{cellData}</a>
      </Cell>
    )
  }
})

const RemoveCell = React.createClass({
  propTypes: propValidation,
  getInitialState () {
    return ({
      showModal: false
    })
  },
  removeData (cellData) {
    let url = `http://${apiSettings.uri}/${this.props.apiCall}/all/${cellData._shortId}`
    axios.delete(url, {auth: apiSettings.auth}).then((response) => {
      if (response.status === 200) {
        this.props.flashMessage('success',
          <span><strong>Success!</strong> <em>{cellData.name}</em> successfully removed.</span>)
      }
      this.props.getData('refresh')
    })
  },
  close () {
    this.setState({ showModal: false })
  },
  open () {
    this.setState({ showModal: true })
  },
  render () {
    const { data, rowIndex, height, width } = this.props
    let cellData = data[rowIndex]
    let dimensons = { height, width }
    const handleClick = {
      onClick: (event) => {
        event.preventDefault()
        this.open()
      }
    }
    return (
      <Cell {...dimensons} className='admin-cell'>
        <a title={`Remove ${cellData.name || cellData.poNumber || ''}`} {...handleClick}>
          <FontAwesome className='fa-fw' name='trash' />
          <Modal show={this.state.showModal} onHide={this.close}
            className='center-on-screen confirm-modal'>
            <Modal.Header>
              Confirm
            </Modal.Header>
            <Modal.Body>
              Are you sure that you want to delete <strong>{cellData.name || cellData.poNumber}</strong>?
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => {
                this.removeData(cellData)
                this.close()
              }}>
                <FontAwesome className='fa-fw' name='check' />Okay
              </Button>
              <Button onClick={this.close}>
                <FontAwesome className='fa-fw' name='times' />Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </a>
      </Cell>
    )
  }
})

const EditCell = React.createClass({
  propTypes: propValidation,
  render () {
    const { data, rowIndex, height, width } = this.props
    let cellData = data[rowIndex]
    let dimensons = { height, width }
    const clickEffect = {
      onClick: (event) => {
        event.preventDefault()
        this.props.setAdminModal(true, cellData)
      }
    }
    return (
      <Cell {...dimensons} className='admin-cell'>
        <a title={`Edit ${cellData.name || cellData.poNumber || ''}`}
          {...clickEffect}
        >
          <FontAwesome className='fa-fw' name='edit' />
        </a>
      </Cell>
    )
  }
})

export default {
  Modal: ModalCell,
  Date: DateCell,
  Text: TextCell,
  Remove: RemoveCell,
  Edit: EditCell
}
