import _ from 'lodash';
import api from '../../../js/api';

export default component =>
  new Promise((resolve, reject) => {
    const err = 0;
    if (err) reject(err);
    const { data } = component.state.form;
    const selectedProps = component.props.form.structure
      .filter(prop => prop.type !== 'readonly' && prop.key !== 'password')
      .map(prop => prop.key);
    const filteredData = _.pick(data, selectedProps);
    if (data.newPassword) filteredData.password = data.newPassword;
    const { shortId, method } = component.state;
    const url = `/users/all/${shortId}`;
    console.log({ method, url, filteredData });
    api
      ._send(method, url, filteredData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
