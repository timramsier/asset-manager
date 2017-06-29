import React from 'react'
import axios from 'axios'
import { Table, Column, Cell } from 'fixed-data-table'
import { Alert } from 'react-bootstrap'
import CustomCell from './CustomCell'
import { findDOMNode } from 'react-dom'
import Search from './Search'
import apiSettings from '../config/apiSettings'
import ReactResizeDetector from 'react-resize-detector'

const { string, arrayOf, shape, number } = React.PropTypes

const DataTable = React.createClass({
  propTypes: {
    apiCall: string.isRequired,
    columns: arrayOf(shape({
      col: string,
      label: string,
      type: string,
      minWidthPix: number,
      maxWidthPer: number
    })),
    targetCall: string
  },
  getInitialState () {
    return ({
      tableWidth: 0,
      rowHeight: 50,
      minColumnWidth: 80,
      data: [],
      searchTerm: '',
      columns: this.props.columns || [],
      alert: {
        type: '',
        message: ''
      },
      skip: 0,
      limit: 24,
      update: true
    })
  },
  getCellType (type) {
    switch (type) {
      case 'text':
        return CustomCell.Text
      case 'date':
        return CustomCell.Date
      case 'modal':
        return CustomCell.Modal
      case 'remove':
        return CustomCell.Remove
      case 'edit':
        return CustomCell.Edit
      default:
        return CustomCell.Text
    }
  },
  setSearchTerm (searchTerm) {
    let newState = this.state
    Object.assign(newState, {searchTerm})
    this.setState(newState)
    this.getData()
  },
  resizeTable (element) {
    var tableWidth = element.offsetWidth
    this.setState({tableWidth})
  },
  refreshData (data) {
    //  allow update on refresh
    this.state.update = true
    let newState = this.state
    newState.data = data
    this.setState(newState)
  },
  pushData (data) {
    // disable updating if response array is smaller than limit
    data.length < this.state.limit ? this.state.update = false : undefined
    let newState = this.state
    newState.data.push.apply(newState.data, data)
    this.setState(newState)
  },
  getData (updateType = 'refresh') {
    let searchString = ''
    if (this.state.searchTerm.length > 0) {
      searchString = `&search=${encodeURIComponent(this.state.searchTerm)}`
    }
    let targetCall = ''
    this.props.targetCall ? targetCall = `/${this.props.targetCall}` : undefined
    let url = `http://${apiSettings.uri}/${this.props.apiCall}/all${targetCall}?limit=${this.state.limit}&skip=${this.state.skip}${searchString}`
    axios.get(url, {auth: apiSettings.auth})
      .then((response) => {
        // add DisplayName if possible
        const _addDisplayName = (data, key) => {
          data.map((entry) => {
            if (entry[key] && entry[key].firstName && entry[key].lastName) {
              entry[key].displayName = `${entry[key].firstName} ${entry[key].lastName}`
            } else {
              Object.assign(entry, {[key]: {displayName: ''}})
            }
          })
          return data
        }
        let responseData = response.data
        responseData = _addDisplayName(responseData, 'assignedTo')
        responseData = _addDisplayName(responseData, 'lastModifiedBy')
        responseData = _addDisplayName(responseData, 'createdBy')
        if (updateType === 'refresh') {
          this.refreshData(responseData)
        } else if (updateType === 'push') {
          this.pushData(responseData)
        }
      })
  },
  flashMessage (type, message) {
    let newState = this.state
    Object.assign(newState, {alert: {type, message}})
    this.setState(newState)
    this.state.alert = {type: '', message: ''}
  },
  handleTableScroll () {
    const innerTable = findDOMNode(findDOMNode(this)
      .childNodes[1])
      .childNodes[0]
    const scrollDiff = innerTable.scrollHeight - innerTable.getBoundingClientRect().height
    if (scrollDiff <= (2 * this.state.rowHeight) && this.state.update) {
      this.state.skip += 24
      this.getData('push')
    }
  },
  componentDidMount () {
    this._thisElement = findDOMNode(this)
    this.getData()
    this.resizeTable(this._thisElement)

    window.addEventListener('resize', (event) => {
      this.resizeTable(this._thisElement)
    }, true)
  },
  render () {
    const columns = this.state.columns
    const { tableWidth, rowHeight } = this.state
    return (
      <div className='data-table'>
        <div className='data-table-controls'>
          <Search
            xs={12} sm={7} md={6} lg={4}
            setSearchTerm={this.setSearchTerm}
            searchType='Assets'
          />
        </div>
        {this.state.alert.type && this.state.alert.message
          ? <div className='table-flash-alert'>
            <Alert bsStyle={this.state.alert.type}>
              {this.state.alert.message}
            </Alert>
          </div>
          : undefined}
        <Table
          onScrollEnd={this.handleTableScroll}
          rowHeight={rowHeight}
          rowsCount={this.state.data.length}
          width={tableWidth}
          height={500}
          headerHeight={rowHeight}>
          {columns.map((column) => {
            const DataCell = this.getCellType(column.type)
            let otherProps
            if (column.subCol) {
              otherProps = {subCol: column.subCol}
            }
            let maxWidth = (this.state.tableWidth - 1) * (column.maxWidthPer / 100)
            return (
              <Column
                key={column.col}
                header={<Cell>{column.label}</Cell>}
                cell={
                  <DataCell
                    flashMessage={this.flashMessage}
                    getData={this.getData}
                    apiCall={this.props.apiCall}
                    data={this.state.data}
                    col={column.col} {...otherProps}
                  />
                }
                width={maxWidth > column.minWidthPix ? maxWidth : column.minWidthPix}
              />
            )
          })}
        </Table>
        <ReactResizeDetector handleWidth handleHeight onResize={() => this.resizeTable(this._thisElement)} />
      </div>
    )
  }
})

export default DataTable