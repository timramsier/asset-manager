const apiSettings = {
  uri: process.env.APP_FRONTEND_API_URI || `http://localhost:3000/api/beta`,
  auth: {
    username: process.env.APP_DATABASE_API_KEY || 'test-api-key',  // this is the api key
    password: 'x'
  }
}

export default apiSettings
