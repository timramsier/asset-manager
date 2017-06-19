import React from 'react'
import { Cell } from 'fixed-data-table'

const { string, number, shape, arrayOf, bool } = React.PropTypes

const propValidation = {
  data: arrayOf(shape({
    _id: string,
    _parent: shape({
      _id: string,
      vendor: string,
      name: string,
      description: string,
      active: bool,
      image: string,
      category: string,
      _shortId: string
    }),
    _shortId: string,
    assetTag: string,
    assignedTo: shape({
      _id: string,
      username: string,
      email: string,
      firstName: string,
      lastName: string,
      displayName: string
    }),
    lastModified: string,
    lastModifiedBy: shape({
      _id: string,
      username: string,
      email: string,
      firstName: string,
      lastName: string,
      displayName: string
    }),
    po: string
  })),
  rowIndex: number,
  col: string,
  subCol: string,
  height: number,
  width: number
}

const DateCell = React.createClass({
  propTypes: propValidation,
  render () {
    const { data, rowIndex, col, subCol, height, width } = this.props
    let dimensons = { height, width }
    let cellData = data[rowIndex][col]
    subCol ? cellData = data[rowIndex][col][subCol] : undefined
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
    let cellData = data[rowIndex][col]
    let dimensons = { height, width }
    subCol ? cellData = data[rowIndex][col][subCol] : undefined
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
    let cellData = data[rowIndex][col]
    let dimensons = { height, width }
    subCol ? cellData = data[rowIndex][col][subCol] : undefined
    return (
      <Cell {...dimensons}>
        <a className='cell-link'>{cellData}</a>
      </Cell>
    )
  }
})

export default {
  Modal: ModalCell,
  Date: DateCell,
  Text: TextCell
}
