const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractLess = new ExtractTextPlugin({
  filename: 'styles.css',
  disable: process.env.NODE_ENV === 'development'
})

module.exports = {
  context: __dirname,
  entry: './js/ClientApp.js',
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js'
  },
  devServer: {
    publicPath: '/public/',
    historyApiFallback: true,
    port: 8080
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: true
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        include: path.resolve(__dirname, 'js'),
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\.less$/,
        use: extractLess.extract({
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'less-loader'
          }],
          // use style-loader in development
          fallback: 'style-loader'
        })
      }
    ]
  },
  plugins: [
    // new ExtractTextPlugin('style.css')
    extractLess
    // if you want to pass in options, you can do so:
    // new ExtractTextPlugin({
    //  filename: 'style.css'
    // })
  ]
}
