const merge = require('webpack-merge')
const webpack = require('webpack')
const common = require('./common')
const join = require('path').join
const nodeExternals = require('../scripts/node-externals')
const { getStyleLoaders } = require('./utils')

module.exports = merge(common, {
  mode: 'production',
  name: 'server',
  target: 'node',
  externals: nodeExternals,
  entry: ['@babel/polyfill', join(__dirname, '../src/server/index')],
  stats: 'minimal',
  // devtool: 'inline-source-map',
  devtool: 'hidden-source-map',
  output: {
    filename: 'app.server.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        exclude: /node_modules/,
        use: getStyleLoaders('sass-loader', {
          isEnvServer: true
        })
      }
    ]
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ]
})
