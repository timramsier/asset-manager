import React from 'react'
import FontAwesome from 'react-fontawesome'
import { Grid, Row, Col } from 'react-bootstrap'
import Edit from './Edit'

const { object, string, arrayOf, shape, func, number } = React.PropTypes

const AdminModal = React.createClass({
  propTypes: {
    data: object,
    formStructure: arrayOf(shape({
      label: string,
      key: string,
      type: string,
      placeholder: string,
      description: string,
      colspan: number
    })),
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
    const { data } = this.props
    const _reset = JSON.parse(JSON.stringify(data))
    this.setState({ data, _reset })
  },
  componentWillUnmount () {
    this.resetData()
  },
  render () {
    let buttonEffect = {
      onClick: (event) => {
        event.preventDefault()
        this.props.setAdminModal(false)
      }
    }
    const { data } = this.state
    return (
      <div className='admin-modal'>
        <div className='admin-modal-controls'>
          <a className='admin-modal-close' {...buttonEffect}>
            <FontAwesome className='fa-fw' name='times' />Close</a>
        </div>
        <Grid>
          <Row>
            <Col md={12}>
              <Edit
                data={data}
                _reset={this.state._reset}
                resetArray={this.resetArray}
                flashMessage={this.props.flashMessage}
                formStructure={this.props.formStructure}
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
