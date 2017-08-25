const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// Plugins
const extractLess = new ExtractTextPlugin({
  filename: 'styles.[hash].css',
  disable: process.env.NODE_ENV === 'development'
})

const definePlugin = new webpack.DefinePlugin({
  'process.env.APP_FRONTEND_API_URI': JSON.stringify(process.env.APP_FRONTEND_API_URI),
  'process.env.APP_DATABASE_API_KEY': JSON.stringify(process.env.APP_DATABASE_API_KEY)
})

const CommonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
  names: ['vendor', 'manifest']
})

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: './src/html/index.html'
})

const webpackCleanupPlugin = new WebpackCleanupPlugin({
  exclude: ['uploads/', 'README.md']
})

const copyWebpackPlugin = new CopyWebpackPlugin([
  {from: 'src/img', to: 'img'}
])

const VENDOR_LIB = [
  'react',
  'react-dom'
]
module.exports = {
  context: __dirname,
  entry: {
    bundle: './src/js/ClientApp.js',
    vendor: VENDOR_LIB
  },
  devtool: 'eval',
  output: {
    publicPath: '/public/',
    path: path.join(__dirname, '/public'),
    filename: '[name].[chunkhash].js'
  },
  devServer: {
    publicPath: '/public/',
    historyApiFallback: true,
    port: 8080
  },
  resolve: {
    extensions: ['.js', '.json']
    // alias: {
    //   react: 'preact-compat',
    //   'react-dom': 'preact-compat'
    // }
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
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve('node_modules/preat-compat/src')
        ],
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
    extractLess,
    definePlugin,
    htmlWebpackPlugin,
    CommonsChunkPlugin,
    webpackCleanupPlugin,
    copyWebpackPlugin
  ]
}
