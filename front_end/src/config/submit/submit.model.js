/* globals FormData */
import axios from 'axios';
import api from '../../js/api';

export default component => {
  const updateData = () =>
    new Promise((resolve, reject) => {
      const data = {};
      component.props.form.structure.forEach(entry => {
        if (entry.type === 'keyvalue') {
          data[entry.key] = component.state.form.data[
            entry.key
          ].map(keyvalue => {
            const { key, value } = keyvalue;
            return { key, value };
          });
        } else if (
          entry.transformValue &&
          entry.transformValue instanceof Function
        ) {
          data[entry.key] = entry.transformValue(
            component.state.form.data[entry.key]
          );
        } else {
          data[entry.key] = component.state.form.data[entry.key];
        }
      });
      const { shortId } = component.state;
      const url = `/models/all/${shortId}`;
      api
        ._send(component.state.method, url, data)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  const removePreviousFile = result =>
    new Promise((resolve, reject) => {
      const filename = result.image
        .split('\\')
        .pop()
        .split('/')
        .pop();
      if (filename) {
        axios
          .delete('/image/delete', {
            data: { target: filename },
          })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      }
      resolve(false);
    });
  const uploadFile = result =>
    new Promise((resolve, reject) => {
      const fileInputs = document.querySelectorAll(
        `.admin-edit-modal input[type="file"]`
      );
      const fileData = new FormData();
      let updateCounter = 0;
      for (let i = 0; i < fileInputs.length; i++) {
        const name = fileInputs[i].getAttribute('name');
        if (fileInputs[i].files[0]) {
          const file = fileInputs[i].files[0];
          let fileName = file.name;
          if (name === 'image') {
            if (component.props.data._id && component.props.data._id !== '') {
              fileName = `${component.props.data._id}.${fileName
                .split('.')
                .pop()}`;
            } else {
              fileName = `${component.state.tempId}.${fileName
                .split('.')
                .pop()}`;
            }
          }
          fileData.append(`fileName-${name}`, fileName);
          fileData.append(name, file);
          updateCounter++;
        }
      }
      if (updateCounter > 0) {
        removePreviousFile(result).then(() => {
          axios
            .put('/image/upload', fileData)
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              reject(err);
            });
        });
      }
      resolve(false);
    });

  return updateData().then(uploadFile);
};
