import axios from 'axios';
import localConfig from '../config/local.config';
import ApiHandler from '../apiHandler/ApiHandler';
import apiSettings from '../config/apiSettings';

const { baseUrl, port } = localConfig;
let url = baseUrl;
if (port && port !== 80) {
  url += `:${port}`;
}

// If user is signed in use their info
axios.get(`${url}/user`).then(response => {
  if (response.data && response.data.username && response.data.password) {
    const { username, password } = response.data;
    Object.assign(apiSettings.auth, { username, password });
  }
});

export default new ApiHandler(apiSettings);
