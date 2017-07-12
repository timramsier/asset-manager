const apiSettings = {
  uri: process.env.APP_FRONTEND_API_URI || 'localhost:3000/api/beta',
  auth: {
    username: process.env.APP_FRONTEND_API_KEY || 'ecfd0226-bce7-4737-c4f3-cdcff87bda68',  // this is the api key
    password: 'x'
  }
}
export default apiSettings
