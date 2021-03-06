import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import { Alert, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { VelocityTransitionGroup } from 'velocity-react';
import ReactResizeDetector from 'react-resize-detector';
import shortid from 'shortid';
import { findDOMNode } from 'react-dom';
import CustomCell from './CustomCell';
import AdminModal from './AdminModal';
import Search from './Search';
import api from '../api';

const {
  string,
  arrayOf,
  shape,
  number,
  bool,
  func,
  oneOfType,
  object,
} = React.PropTypes;

const DataTable = React.createClass({
  propTypes: {
    apiCall: string.isRequired,
    columns: arrayOf(
      shape({
        col: string,
        label: string,
        type: string,
        minWidthPix: number,
        maxWidthPer: number,
      })
    ),
    targetCall: string,
    showTotal: bool,
    form: shape({
      structure: arrayOf(
        shape({
          label: string,
          key: string,
          type: string,
          placeholder: string,
          description: oneOfType([string, object]),
        })
      ),
      submit: func,
    }),
  },
  getInitialState() {
    return {
      key: shortid(),
      tableWidth: 0,
      rowHeight: 50,
      minColumnWidth: 80,
      data: [],
      searchTerm: '',
      columns: this.props.columns || [],
      alert: {
        type: '',
        message: '',
      },
      skip: 0,
      limit: 24,
      update: true,
      metaData: {},
      adminModal: {
        open: false,
        data: {},
        _reset: {},
      },
    };
  },
  getCellType(type) {
    switch (type) {
      case 'text':
        return CustomCell.Text;
      case 'date':
        return CustomCell.Date;
      case 'modal':
        return CustomCell.Modal;
      case 'remove':
        return CustomCell.Remove;
      case 'edit':
        return CustomCell.Edit;
      default:
        return CustomCell.Text;
    }
  },
  setSearchTerm(searchTerm) {
    const newState = this.state;
    Object.assign(newState, { searchTerm, skip: 0 });
    this.setState(newState);
    this.getData();
  },
  setAdminModal(open, data, form) {
    const newState = this.state;
    Object.assign(newState.adminModal, {
      open,
      data,
      form,
    });
    this.setState(newState);
    // locks .main-content from scrolling when modal is open
    if (open) {
      document.querySelectorAll('.main-content').forEach(element => {
        element.style.bottom = 0;
      });
    } else {
      document.querySelectorAll('.main-content').forEach(element => {
        element.style.bottom = 'auto';
      });
    }
  },
  resizeTable(element) {
    if (this._isMounted) {
      const tableWidth = element.offsetWidth;
      this.setState({ tableWidth });
    }
  },
  resetTable() {
    this.getData('refresh');
  },
  refreshData(data) {
    //  allow update on refresh
    this.state.update = true;
    const newState = this.state;
    Object.assign(newState, { data });
    this.setState(newState);
  },
  pushData(data) {
    // disable updating if response array is smaller than limit
    if (data.length < this.state.limit) {
      this.state.update = false;
    }
    const newState = this.state;
    newState.data.push(...data);
    this.setState(newState);
  },
  getMetaData() {
    api.getMetaData(this.props.apiCall).then(response => {
      const { count } = response;
      const newState = this.state;
      Object.assign(newState, { metaData: { count } });
      this.setState(newState);
    });
  },
  getData(updateType = 'refresh') {
    let search;
    if (this.state.searchTerm.length > 0) {
      search = encodeURIComponent(this.state.searchTerm);
    }
    let targetCall = '';
    if (this.props.targetCall) {
      targetCall = `/${this.props.targetCall}`;
    }
    api
      ._get(`${this.props.apiCall}/all${targetCall}`, {
        limit: this.state.limit,
        skip: this.state.skip,
        search,
      })
      .then(response => {
        const responseData = response;
        if (updateType === 'refresh') {
          this.refreshData(responseData);
        } else if (updateType === 'push') {
          this.pushData(responseData);
        }
      });
  },
  flashMessage(type, message) {
    const newState = this.state;
    Object.assign(newState, { alert: { type, message } });
    this.setState(newState);
    // setTimeout(() => { this.state.alert = {type: '', message: ''} }, 0)
  },
  handleTableScroll() {
    const innerTable = findDOMNode(findDOMNode(this).childNodes[1])
      .childNodes[0];
    const scrollDiff =
      innerTable.scrollHeight - innerTable.getBoundingClientRect().height;
    if (scrollDiff <= 2 * this.state.rowHeight && this.state.update) {
      this.state.skip += 24;
      this.getData('push');
    }
  },
  componentDidMount() {
    this._isMounted = true;
    this._thisElement = findDOMNode(this);
    this.getMetaData();
    this.getData();
    this.resizeTable(this._thisElement);

    window.addEventListener(
      'resize',
      () => {
        this.resizeTable(this._thisElement);
      },
      true
    );
  },
  comonentWillUnmount() {
    this._isMounted = false;
  },
  render() {
    const columns = this.state.columns;
    const { tableWidth, rowHeight } = this.state;
    const modelModalAnimationProps = {
      runOnMount: true,
      enter: {
        animation: {
          top: 0,
          opacity: 1.0,
        },
        duration: 400,
      },
      leave: {
        animation: {
          top: '100%',
          opacity: 0.0,
        },
        duration: 400,
      },
    };
    return (
      <div className="data-table" key={this.state.key}>
        <div className="data-table-controls">
          {this.props.form &&
            this.props.form.structure &&
            !this.props.form.disableNew && (
              <Button
                className="add-new-entry"
                title="Add New"
                onClick={() => this.setAdminModal(true)}
              >
                <FontAwesome name="plus" />
              </Button>
            )}
          <Search
            xs={12}
            sm={7}
            md={6}
            lg={4}
            setSearchTerm={this.setSearchTerm}
            searchType="Assets"
          />
        </div>
        {this.state.metaData.count && this.props.showTotal ? (
          <div className="data-table-data">
            <strong>Total Items:</strong> {this.state.metaData.count}
          </div>
        ) : (
          undefined
        )}
        {this.state.alert.type && this.state.alert.message ? (
          <div className="table-flash-alert">
            <Alert bsStyle={this.state.alert.type}>
              {this.state.alert.message}
            </Alert>
          </div>
        ) : (
          undefined
        )}
        <Table
          onScrollEnd={this.handleTableScroll}
          rowHeight={rowHeight}
          rowsCount={this.state.data.length}
          width={tableWidth}
          height={500}
          headerHeight={rowHeight}
        >
          {columns.map(column => {
            const DataCell = this.getCellType(column.type);
            let otherProps;
            let data = this.state.data;
            if (column.subCol) {
              otherProps = { subCol: column.subCol };
            }
            if (
              column.transformData &&
              column.transformData instanceof Function
            ) {
              data = column.transformData(data);
            }
            const maxWidth =
              (this.state.tableWidth - 1) * (column.maxWidthPer / 100);
            return (
              <Column
                key={column.col}
                header={<Cell>{column.label}</Cell>}
                cell={
                  <DataCell
                    setAdminModal={this.setAdminModal}
                    flashMessage={this.flashMessage}
                    getData={this.getData}
                    apiCall={this.props.apiCall}
                    data={data}
                    col={column.col}
                    {...otherProps}
                  />
                }
                width={
                  maxWidth > column.minWidthPix ? maxWidth : column.minWidthPix
                }
              />
            );
          })}
        </Table>
        <VelocityTransitionGroup {...modelModalAnimationProps}>
          {this.state.adminModal.open ? (
            <AdminModal
              flashMessage={this.flashMessage}
              resetTable={this.resetTable}
              form={this.props.form}
              data={this.state.adminModal.data}
              _reset={this.state.adminModal._reset}
              setAdminModal={this.setAdminModal}
            />
          ) : (
            undefined
          )}
        </VelocityTransitionGroup>
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={() => this.resizeTable(this._thisElement)}
        />
      </div>
    );
  },
});

export default DataTable;
