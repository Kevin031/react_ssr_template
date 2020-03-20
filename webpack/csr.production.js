const merge = require('webpack-merge')
const client = require('./client.production')
const { join } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = merge(client, {
  mode: 'production',
  name: 'csr',
  target: 'web',
  entry: [join(__dirname, '../src/csr/index')],
  devtool: 'hidden-source-map',
  output: {
    path: join(__dirname, '../dist'),
    publicPath: '/',
    filename: 'app.[hash:6].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/csr/document.html'
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
