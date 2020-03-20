const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin')
const isEnvDevelopment = process.env.NODE_ENV === 'development'
const isEnvProduction = process.env.NODE_ENV === 'production'

const getStyleLoaders = (preProcessor, { isEnvServer } = {}) => {
  const shouldUseRelativeAssetPaths = false
  const shouldUseSourceMap = true

  const loaders = [
    // isEnvDevelopment && require.resolve('style-loader'),
    !isEnvServer && {
      loader: ExtractCssChunksPlugin.loader,
      options: Object.assign(
        {},
        shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined
      )
    },
    {
      loader: require.resolve(isEnvServer ? 'css-loader/locals' : 'css-loader'),
      options: {
        minimize: isEnvProduction
        // modules: true,
        // localIdentName: '[name]__[local]--[hash:base64:5]'
      }
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        // plugins: () => [
        //   require('postcss-flexbugs-fixes'),
        //   require('postcss-preset-env')({
        //     autoprefixer: {
        //       flexbox: 'no-2009',
        //     },
        //     stage: 3,
        //   }),
        // ],
        sourceMap: isEnvProduction && shouldUseSourceMap
      }
    }
  ].filter(Boolean)
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: isEnvProduction && shouldUseSourceMap
      }
    })
  }
  return loaders
}

module.exports = {
  getStyleLoaders
}
