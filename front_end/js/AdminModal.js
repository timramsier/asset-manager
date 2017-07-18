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
    setAdminModal: func
  },
  render () {
    let buttonEffect = {
      onClick: (event) => {
        event.preventDefault()
        this.props.setAdminModal(false)
      }
    }
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
                data={this.props.data}
                formStructure={this.props.formStructure}
                setAdminModal={this.props.setAdminModal}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
})

export default AdminModal
