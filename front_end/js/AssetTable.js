import React from 'react'
import axios from 'axios'
import { Table, Column, Cell } from 'fixed-data-table'
import FontAwesome from 'react-fontawesome'
import CustomCell from './CustomCell'
import Search from './Search'
import apiSettings from '../config/apiSettings'

const { string } = React.PropTypes

const AssetTable = React.createClass({
  propTypes: {
    shortId: string
  },
  getInitialState () {
    return ({
      tableWidth: 0,
      rowHeight: 50,
      minColumnWidth: 80,
      assets: [],
      searchTerm: '',
      columns: [
        {
          col: 'sn',
          label: 'Serial',
          type: 'modal',
          minWidthPix: 100,
          maxWidthPer: 18
        },
        {
          col: 'assetTag',
          label: 'Asset Tag',
          type: 'text',
          minWidthPix: 80,
          maxWidthPer: 15
        },
        {
          col: 'status',
          label: 'Status',
          type: 'text',
          minWidthPix: 80,
          maxWidthPer: 15
        },
        {
          col: 'assignedTo',
          subCol: 'displayName',
          label: 'Assigned To',
          type: 'text',
          minWidthPix: 100,
          maxWidthPer: 15
        },
        { col: 'po',
          subCol: 'poNumber',
          label: 'P.O.',
          type: 'text',
          minWidthPix: 80,
          maxWidthPer: 15
        },
        {
          col: 'lastModified',
          label: 'Last Modified',
          type: 'date',
          minWidthPix: 80,
          maxWidthPer: 22
        }
      ]
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
      default:
        return CustomCell.Text
    }
  },
  setSearchTerm (searchTerm) {
    let newState = this.state
    Object.assign(newState, {searchTerm})
    this.setState(newState)
    this.getAssetData(this.props.shortId)
  },
  resizeTable (selector) {
    var tableWidth = document.querySelector(selector).offsetWidth
    this.setState({tableWidth})
  },
  updateAssetData (assets) {
    let newState = this.state
    Object.assign(newState, {assets})
    this.setState(newState)
  },
  getAssetData (shortId) {
    let searchString = ''
    if (this.state.searchTerm.length > 0) {
      searchString = `?search=${encodeURIComponent(this.state.searchTerm)}`
    }
    let url = `http://${apiSettings.uri}/assets/all/${shortId}${searchString}`
    console.log(url)
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

        let responseData
        responseData = _addDisplayName(response.data, 'assignedTo')
        responseData = _addDisplayName(responseData, 'lastModifiedBy')
        this.updateAssetData(responseData)
      })
  },
  componentDidMount () {
    this.getAssetData(this.props.shortId)
    this.resizeTable('.asset-table')
    window.addEventListener('resize', (event) => {
      this.resizeTable('.asset-table')
    }, true)
  },
  render () {
    const { tableWidth, rowHeight } = this.state
    return (
      <div className='asset-table'>
        <div className='asset-table-controls'>
          <Search
            xs={12} sm={7} md={8} lg={6}
            setSearchTerm={this.setSearchTerm}
            searchType='Assets'
          />
          <div className='button-group'>
            <a className='table-button' title='Add Asset'>
              <FontAwesome name='plus' className='fa-fw' />
            </a>
          </div>
        </div>
        <Table
          rowHeight={rowHeight}
          rowsCount={this.state.assets.length}
          width={tableWidth}
          height={500}
          headerHeight={rowHeight}>
          {this.state.columns.map((column) => {
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
                cell={<DataCell data={this.state.assets} col={column.col} {...otherProps} />}
                width={maxWidth > column.minWidthPix ? maxWidth : column.minWidthPix}
              />
            )
          })}
        </Table>
      </div>
    )
  }
})

export default AssetTable
