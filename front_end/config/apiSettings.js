const apiSettings = {
  uri: process.env.APP_FRONTEND_API_URI || 'localhost:3000/api/beta',
  auth: {
    username: 'test-api-key',  // this is the api key
    password: 'x'
  }
}
export default apiSettings
