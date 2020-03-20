const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./common')
const { join } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin')
const { getStyleLoaders } = require('./utils')

module.exports = merge(common, {
  mode: 'development',
  name: 'csr',
  target: 'web',
  entry: [
    'webpack-hot-middleware/client?noInfo=true&reload=true',
    '@babel/polyfill',
    join(__dirname, '../src/csr/index')
  ],
  devtool: '#@cheap-module-eval-source-map',
  output: {
    path: join(__dirname, '../dist'),
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
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
    new ExtractCssChunksPlugin(),
    new HtmlWebpackPlugin({
      template: join(__dirname, '../src/csr/document.html'),
      filename: 'index.html',
      inject: true
    }),
    new CopyPlugin([
      {
        context: join(__dirname, '../devel-public/assets'),
        from: '**/*',
        to: join(__dirname, '../dist')
      }
    ])
  ]
})
