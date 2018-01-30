import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import DataTable from './DataTable';
import { addDisplayName } from '../../config/transforms/functions';

const { func, shape, string, array, bool, object } = React.PropTypes;

const ModelModal = React.createClass({
  propTypes: {
    setModelModal: func,
    model: shape({
      _id: string,
      vendor: string,
      active: bool,
      name: string,
      version: string,
      image: string,
      description: string,
      assets: array,
      _parent: shape({
        _id: string,
        name: string,
        description: string,
        label: string,
        config: shape({
          faIcon: string,
          color: string,
          api: string,
          fallbackImage: string,
        }),
        _shortId: string,
      }),
    }),
    apiHandler: object,
  },
  render() {
    const buttonEffect = {
      onClick: event => {
        event.preventDefault();
        this.props.setModelModal(false, {});
      },
    };
    const { model } = this.props;
    let activeState;
    if (model.active) {
      activeState = (
        <span>
          <FontAwesome name="thumbs-up" className="fa-fw" /> Active
        </span>
      );
    } else {
      activeState = (
        <span>
          <FontAwesome name="thumbs-down" className="fa-fw" /> Inactive
        </span>
      );
    }
    let thumbnailImage;
    let thumbnailClass;
    if (model.image) {
      thumbnailImage = model.image;
      thumbnailClass = 'with-image';
    } else {
      thumbnailImage = model._parent.config.fallbackImage;
      thumbnailClass = 'no-image';
    }
    const columns = [
      {
        col: 'sn',
        label: 'Serial',
        type: 'modal',
        minWidthPix: 100,
        maxWidthPer: 18,
      },
      {
        col: 'assetTag',
        label: 'Asset Tag',
        type: 'text',
        minWidthPix: 80,
        maxWidthPer: 15,
      },
      {
        col: 'status',
        label: 'Status',
        type: 'text',
        minWidthPix: 80,
        maxWidthPer: 15,
      },
      {
        col: 'assignedTo',
        subCol: 'displayName',
        label: 'Assigned To',
        type: 'text',
        minWidthPix: 100,
        maxWidthPer: 15,
        transformData: data => addDisplayName(data, 'assignedTo', 'Unassigned'),
      },
      {
        col: 'po',
        subCol: 'poNumber',
        label: 'P.O.',
        type: 'text',
        minWidthPix: 80,
        maxWidthPer: 15,
      },
      {
        col: 'lastModified',
        label: 'Last Modified',
        type: 'date',
        minWidthPix: 80,
        maxWidthPer: 22,
      },
    ];
    return (
      <div className="asset-modal">
        <Grid fluid>
          <Row className="header">
            <Grid className="fluid-at-lg">
              <Row>
                <Col xs={12} sm={4} smPush={8}>
                  <a className="modal-close" {...buttonEffect}>
                    <FontAwesome className="fa-fw" name="times" />Close
                  </a>
                </Col>
                <Col xs={12} sm={8} smPull={4}>
                  <h1>
                    {model.name} <small>{model.vendor}</small>
                  </h1>
                  <h4>{model.version}</h4>
                  <h3>{model.description}</h3>
                  <div className="details">
                    <span
                      className="detail category"
                      style={{ backgroundColor: model.color }}
                    >
                      <FontAwesome
                        name={model._parent.config.faIcon}
                        className="fa-fw"
                      />{' '}
                      {model.category}
                    </span>
                    <span className={`detail active-${model.active}`}>
                      {activeState}
                    </span>
                  </div>
                </Col>
              </Row>
            </Grid>
          </Row>
          <Row className="body">
            <Grid className="fluid-at-lg">
              <Row>
                <Col xs={12} sm={4} smPush={8}>
                  <div className="info-card">
                    <section className="image">
                      <img
                        src={thumbnailImage}
                        className={`img-responsive ${thumbnailClass}`}
                        alt="model"
                      />
                    </section>
                    <section className="specs">
                      <h3>Specifications:</h3>
                      <table className="specs-table">
                        <tbody>
                          {model.specs.map(spec => (
                            <tr key={`spec_${spec._id}_${spec.key}`}>
                              <td>{spec.key}:</td>
                              <td>{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </section>
                  </div>
                </Col>
                <Col xs={12} sm={8} smPull={4}>
                  <div className="assets">
                    <h3>Assets</h3>
                    <DataTable
                      apiHandler={this.props.apiHandler}
                      apiCall="assets"
                      targetCall={model._shortId}
                      columns={columns}
                    />
                  </div>
                </Col>
              </Row>
            </Grid>
          </Row>
        </Grid>
      </div>
    );
  },
});

export default ModelModal;
