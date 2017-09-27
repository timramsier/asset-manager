import axios from 'axios';

const ApiHandler = options => {
  const _default = {
    uri: `http://localhost:3000/api/beta`,
    auth: {
      username: 'test-api-key',
      password: 'x',
    },
  };

  const auth = Object.assign({}, _default.auth);
  const _options = Object.assign(_default, options);
  if (options.auth) Object.assign(auth, options.auth);
  Object.assign(_options.auth, auth);

  const _instance = axios.create({
    baseURL: _options.uri,
    auth: _options.auth,
    timeout: 1000,
  });

  const _get = (url, params) =>
    _instance({ method: 'get', url, params })
      .then(response => response.data)
      .catch(err => err);

  const _send = (method, url, data) =>
    _instance({ method, url, data })
      .then(response => response.data)
      .catch(err => err);

  const _delete = url =>
    _instance({ method: 'delete', url })
      .then(response => response.data)
      .catch(err => err);

  const api = {
    _instance,
    _get,
    _send,
    _delete,
    getUsers: params => _get('users', params),
    getUserByUsername: username => _get('users', { username }),
    getUserById: _id => _get('users', { _id }),
    loginById: (_id, password) =>
      _send('post', 'users/login', { _id, password }),
    getCategories: params => _get('categories', params),
    getModels: (category, params) => _get(`models/${category}`, params),
    getMetaData: url => _get(`${url}/all/meta`),
    addPO: (poNumber, bu) => _send('post', 'pos', { poNumber, bu }),
    addAsset: data => _send('post', 'assets', data),
  };

  return api;
};
// apiHandler = new ApiHandler({auth: {username:'not-secure-api-key'}})

export default ApiHandler;
