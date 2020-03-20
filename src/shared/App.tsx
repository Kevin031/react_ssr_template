import React from 'react'
import Helmet from 'react-helmet'
import Home from './pages/Home'
import { Switch, Route } from 'react-router-dom'
import { observer } from 'mobx-react'

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return null
  }
}

@observer
class App extends React.Component<any, any> {
  async componentDidMount () {}

  render () {
    return <div>
      <Helmet>
        <title>Kevin's Blog</title>
      </Helmet>
      <ScrollToTop {...this.props} />
      <Switch location={this.props.location}>
        <Route exact path='/' render={props => <Home {...props} />} />
      </Switch>
    </div>
  }
}

export default App
