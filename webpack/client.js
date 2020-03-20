const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./common')
const { join } = require('path')
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin')
const { getStyleLoaders } = require('./utils')

module.exports = merge(common, {
  mode: 'development',
  name: 'client',
  target: 'web',
  entry: [
    'webpack-hot-middleware/client',
    '@babel/polyfill',
    join(__dirname, '../src/client/index')
  ],
  devtool: 'inline-source-map',
  output: {
    path: join(__dirname, '../devel-public/assets'),
    publicPath: '/',
    filename: 'app.client.js',
    chunkFilename: '[name].chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        exclude: /node_modules/,
        use: getStyleLoaders('sass-loader')
      }
    ]
  },
  optimization: {
    runtimeChunk: {
      name: 'bootstrap'
    },
    splitChunks: {
      chunks: 'initial',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor'
        }
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractCssChunksPlugin()
  ]
})
