const { join } = require('path')
const WebpackBar = require('webpackbar')
const { getStyleLoaders } = require('./utils')

module.exports = {
  output: {
    path: join(__dirname, '../public'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    modules: [join(__dirname, '../src'), 'node_modules'],
    alias: {
      // 'react-bootstrap': 'react-bootstrap/dist/react-bootstrap.min.js',
      '@': join(__dirname, '../src/shared')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'imgs/[name].[hash:6].[ext]'
        }
      },
      {
        test: /\.(mp3|mp4|webm|ogg)(\?.*)?$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'media/[name].[hash:6].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:6].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: getStyleLoaders()
      }
      // {
      //   loader: require.resolve('file-loader'),
      //   // Exclude `js` files to keep "css" loader working as it injects
      //   // its runtime that would otherwise be processed through "file" loader.
      //   // Also exclude `html` and `json` extensions so they get processed
      //   // by webpacks internal loaders.
      //   exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
      //   options: {
      //     name: 'static/media/[name].[hash:8].[ext]',
      //   },
      // }
    ]
  },
  plugins: [
    new WebpackBar()
  ]
}
