import 'core-js/es6/map'
import 'core-js/es6/set'
// import 'core-js/es7/string'
import 'core-js/fn/object/assign'
import 'core-js/fn/array/includes'
import 'core-js/fn/array/find'
import 'core-js/fn/array/find-index'
import 'regenerator-runtime/runtime'

import React from 'react'
import { hydrate } from 'react-dom'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import App from '../shared/App'
import createStore from '../shared/stores'
import { Provider } from 'mobx-react'

const initStates = window.__init_states__ || {}
const stores = createStore(initStates)
delete window.__init_states__

/**
 * Renders a react component into the #react-root div container.
 * Since react 16, the `hydrate` method is used instead of `render` when dealing
 * with server side rendering.
 *
 * @param Component React component that should be rendered
 */
const render = (Component) => {
  hydrate(
    <Provider {...stores}>
      <Router>
        <Route component={props => <Component { ...props } />} />
      </Router>
    </Provider>,
    document.getElementById('react-root')
  )
}

render(App)

/**
 * This script provides hot module reloading in development mode.
 */
if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept('../shared/App', () => {
    const NextApp = require('../shared/App').default
    render(NextApp)
  })
}

;(function (history) {
  var pushState = history.pushState
  var replaceState = history.replaceState
  history.pushState = function (state) {
    if (typeof history.onpushstate === 'function') {
      history.onpushstate({ state: state })
    }
    return pushState.apply(history, arguments)
  }
  history.replaceState = function (state) {
    if (typeof history.onreplacestate === 'function') {
      history.onreplacestate({ state: state })
    }
    return replaceState.apply(history, arguments)
  }
})(window.history)

window._HISTORY_STATE_CHANGED_ = false

history.onpushstate = history.onreplacestate = function () {
  window._HISTORY_STATE_CHANGED_ = true
}
