const merge = require('webpack-merge')
const common = require('./common')
const { join } = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin')
const StatsWebpackPlugin = require('stats-webpack-plugin')
const { getStyleLoaders } = require('./utils')

module.exports = merge(common, {
  mode: 'production',
  name: 'client',
  target: 'web',
  entry: [join(__dirname, '../src/client/index')],
  // devtool: 'inline-source-map',
  devtool: 'cheap-source-map',
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  },
  output: {
    path: join(__dirname, '../public/assets'),
    publicPath: '/',
    filename: 'app.client.[hash:6].js',
    chunkFilename: 'js/[name].chunk.[contenthash:6].js'
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        exclude: /node_modules/,
        use: getStyleLoaders('sass-loader'),
        sideEffects: true
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true
      })
    ],
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
    new StatsWebpackPlugin('stats.json'),
    new ExtractCssChunksPlugin({
      filename: 'css/[name].[hash:6].css',
      // chunkFilename: 'css/[name].[contenthash:6].css',
      orderWarning: true
    })
  ]
})
