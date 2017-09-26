import _ from 'lodash';
import api from '../../../js/api';

export default component =>
  new Promise((resolve, reject) => {
    const { data } = component.state.form;
    if (data.assignedTo !== null && data.assignedTo._id)
      data.assignedTo = data.assignedTo._id;
    const selectedProps = component.props.form.structure
      .filter(prop => prop.type !== 'readonly')
      .map(prop => prop.key);
    const filteredData = _.pick(data, selectedProps);
    const { shortId } = component.state;
    const url = `/assets/all/${shortId}`;
    api
      ._send(component.state.method, url, filteredData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
