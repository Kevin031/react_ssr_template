import url from 'url'
import React from 'react'
import ReactDOM from 'react-dom/server'
import Helmet from 'react-helmet'
import { Provider, useStaticRendering } from 'mobx-react'
import { flushChunkNames } from 'react-universal-component/server'
import flushChunks from 'webpack-flush-chunks'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import { ServerStyleSheets, ThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import createDocument from './document'
import { StaticRouter, matchPath } from 'react-router'
import htmlescape from 'htmlescape'

import App from '../shared/App'
import createStore from '../shared/stores'
import Routes from '../routes'

useStaticRendering(true)

// 生成快照
function dehydrate (store) {
  return htmlescape(store.getData())
}

/**
 * Provides the server side rendered app. In development environment, this method is called by
 * `react-hot-server-middleware`.
 *
 * This method renders the ejs template `public/views/index.ejs`.
 *
 * @param clientStats Parameter passed by hot server middleware
 */
export default ({ clientStats }) => async (req, res, next) => {
  // 拦截静态资源
  if (
    ([
      '/css/bootstrap.min.css',
      '/css/bootstrap.min.css.map',
      '/favicon.ico'
    ]).includes(req.path)
  ) {
    return next()
  }

  const styledSheet = new ServerStyleSheet()
  const materialSheet = new ServerStyleSheets()

  try {
    global.hostname = req.hostname
    const store = createStore({})
    const context = {}
    let promise

    const appId = req.hostname.split('.')[0]

    const currentPath = req.path

    let currentRoute = Routes.find(route => matchPath(currentPath, route)) || {}

    await App.getInitialProps({
      req,
      store,
      appId,
      match: matchPath(currentPath, currentRoute) || {},
      location: {
        pathname: currentPath,
        query: req.query
      }
    })

    if (currentRoute.component && currentRoute.component.getInitialProps) {
      const ctx = {
        req,
        store,
        match: matchPath(currentPath, currentRoute) || {},
        location: {
          pathname: currentPath,
          query: req.query
        }
      }
      promise = currentRoute.component.getInitialProps(ctx)
    } else {
      promise = Promise.resolve(null)
    }

    await promise

    const app = (
      <StyleSheetManager sheet={styledSheet.instance}>
        <ThemeProvider theme={createMuiTheme()}>
          <Provider {...store}>
            <StaticRouter location={req.url} context={context}>
              <App />
            </StaticRouter>
          </Provider>
        </ThemeProvider>
      </StyleSheetManager>
    )

    const appString = ReactDOM.renderToString(styledSheet.collectStyles(materialSheet.collect(app)))
    const styleTags = styledSheet.getStyleTags()
    const materialStyleTags = `<style id ="material-server-side">${materialSheet.toString()}</style>`
    const helmet = Helmet.renderStatic()
    const chunkNames = flushChunkNames()
    const { js, styles } = flushChunks(clientStats, { chunkNames })
    const themeStyleTag = store.themeStore.settings.css_file ? `<link id="theme-style_${store.themeStore.settings.theme_key}" href="${store.themeStore.settings.css_file}" rel="stylesheet">` : ''
    // devel
    // const themeStyleTag = ''
    const document = createDocument({
      appString,
      js,
      styles: styles + styleTags + materialStyleTags + themeStyleTag,
      helmet,
      stores: dehydrate(store)
    })

    /*
     * See https://reacttraining.com/react-router/web/guides/server-rendering for details
     * on this configuration.
     */
    if (context.url) {
      res.set('Cache-Control', 'no-cache')
      res.writeHead(301, {
        Location: context.url
      })
      res.end()
    } else {
      res.set('X-Frame-Options', 'sameorigin')
      const referer = req.get('referer')
      if (referer) {
        const origin = (new url.URL(referer)).origin
        res.set('X-Frame-Options', `allow-from ${origin}`)
      }
      res.set('Content-Type', 'text/html').end(document)
    }
  } catch (err) {
    console.error(err)
    res.send(`
      Server error: ${err.message}
      <br />
      ${err.stack}
    `, 500)
    res.end()
  } finally {
    styledSheet.seal()
  }
}
