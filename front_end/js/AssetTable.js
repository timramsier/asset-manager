import React from 'react'
import { Table, Column, Cell } from 'fixed-data-table'

const { string } = React.PropTypes

const AssetTable = React.createClass({
  propTypes: {
    shortId: string
  },
  getInitialState () {
    return ({
      tableWidth: 0,
      rowHeight: 50,
      minColumnWidth: 110
    })
  },
  resizeTable (selector) {
    var tableWidth = document.querySelector(selector).offsetWidth
    this.setState({tableWidth})
  },
  componentDidMount () {
    this.resizeTable('.asset-table')
    window.addEventListener('resize', (event) => {
      this.resizeTable('.asset-table')
    }, true)
  },
  render () {
    const rows = [
      ['a1', 'b1', 'c1', 'd1', 'e1', 'f1'],
      ['a2', 'b2', 'c2', 'd2', 'e2', 'f2'],
      ['a3', 'b3', 'c3', 'd3', 'e3', 'f3']]
    const { tableWidth, rowHeight, minColumnWidth } = this.state
    return (
      <div className='asset-table'>
        <Table
          rowHeight={rowHeight}
          rowsCount={rows.length}
          width={tableWidth}
          height={500}
          headerHeight={rowHeight}>
          <Column
            header={<Cell>Asset Tag</Cell>}
            cell={<Cell>123456</Cell>}
            width={tableWidth / 6 > minColumnWidth ? tableWidth / 6 : minColumnWidth}
          />
          <Column
            header={<Cell>Status</Cell>}
            cell={<Cell>Deployed</Cell>}
            width={tableWidth / 6 > minColumnWidth ? tableWidth / 6 : minColumnWidth}
          />
          <Column
            header={<Cell>Assigned To</Cell>}
            cell={<Cell>John Doe</Cell>}
            width={tableWidth / 6 > minColumnWidth ? tableWidth / 6 : minColumnWidth}
          />
          <Column
            header={<Cell>Serial</Cell>}
            cell={<Cell>1234567890asdf</Cell>}
            width={tableWidth / 6 > minColumnWidth ? tableWidth / 6 : minColumnWidth}
          />
          <Column
            header={<Cell>P.O.</Cell>}
            cell={<Cell>1234567</Cell>}
            width={tableWidth / 6 > minColumnWidth ? tableWidth / 6 : minColumnWidth}
          />
          <Column
            header={<Cell>Last Modified</Cell>}
            cell={<Cell>01/01/17 11:00</Cell>}
            width={tableWidth / 6 > minColumnWidth ? tableWidth / 6 : minColumnWidth}
          />
        </Table>
      </div>
    )
  }
})

export default AssetTable
