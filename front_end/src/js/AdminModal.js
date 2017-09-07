import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import Edit from './Edit'

const { object, string, arrayOf, shape, func, number, oneOfType } = React.PropTypes

const AdminModal = React.createClass({
  propTypes: {
    data: object,
    form: shape({
      structure: arrayOf(shape({
        label: string,
        key: string,
        type: string,
        placeholder: string,
        description: oneOfType([string, object]),
        colspan: number
      })),
      submit: func
    }),
    setAdminModal: func,
    resetTable: func,
    flashMessage: func
  },
  getInitialState () {
    return ({
      data: {},
      _reset: {}
    })
  },
  resetData () {
    let newState = this.state
    Object.assign(newState.data, this.state._reset)
    this.setState(newState)
  },
  componentWillMount () {
    if (this.props.data) {
      const { data } = this.props
      const _reset = JSON.parse(JSON.stringify(data))
      this.setState({ data, _reset })
    }
  },
  componentWillUnmount () {
    this.resetData()
  },
  render () {
    const { data } = this.state
    return (
      <div className='admin-modal'>
        <Grid>
          <Row>
            <Col md={12}>
              <Edit
                data={data}
                _reset={this.state._reset}
                resetArray={this.resetArray}
                flashMessage={this.props.flashMessage}
                form={this.props.form}
                setAdminModal={this.props.setAdminModal}
                resetTable={this.props.resetTable}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
})

export default AdminModal
