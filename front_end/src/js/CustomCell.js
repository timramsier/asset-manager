import React from 'react'
import { Cell } from 'fixed-data-table'
import FontAwesome from 'react-fontawesome'
import api from './api'
import axios from 'axios'
import addConfirmModal from './addConfirmModal'

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
  component: object,
  openConfirmModal: func,
  closeConfirmModal: func
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
    const removeImage = (result) => new Promise((resolve, reject) => {
      if (result.image) {
        var filename = result.image.split('\\').pop().split('/').pop()
        axios.delete('/image/delete', {
          data: {target: filename}
        })
          .then(res => { resolve(res) })
          .catch(err => { reject(err) })
      } else {
        resolve(cellData)
      }
    })
    const removeData = (cellData) => new Promise((resolve, reject) => {
      let url = `${this.props.apiCall}/all/${cellData._shortId}`
      api._delete(url).then((response) => {
        if (response.status === 200) {
          this.props.flashMessage('success',
            <span><strong>Success!</strong> <em>{cellData.name}</em> successfully removed.</span>)
        }
        this.props.getData('refresh')
        resolve(cellData)
      })
    })

    removeData(cellData).then(removeImage)
  },
  render () {
    const { data, rowIndex, height, width } = this.props
    let cellData = data[rowIndex]
    let dimensons = { height, width }
    const handleClick = {
      onClick: (event) => {
        event.preventDefault()
        this.props.openConfirmModal({
          header: 'Delete Entry',
          body: <span>Are you sure that you want to delete <strong>{cellData.name || cellData.poNumber}</strong>?</span>,
          onConfirm: () => {
            this.removeData(cellData)
            this.props.closeConfirmModal()
          }
        })
      }
    }
    return (
      <Cell {...dimensons} className='admin-cell'>
        <a title={`Remove ${cellData.name || cellData.poNumber || ''}`} {...handleClick}>
          <FontAwesome className='fa-fw' name='trash' />
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
  Remove: addConfirmModal(RemoveCell),
  Edit: EditCell
}
