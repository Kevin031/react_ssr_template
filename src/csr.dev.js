import express from 'express'
import helmet from 'helmet'
import { join } from 'path'
import { log } from 'winston'

/**
 * Configures hot reloading and assets paths for local development environment.
 * Use the `npm start` command to start the local development server.
 *
 * @param app Express app
 */
const configureDevelopment = (app) => {
  const config = require('../webpack/csr')
  // const serverConfig = require('../webpack/server')
  const { publicPath, path } = config.output

  const compiler = require('webpack')(config)
  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath,
    stats: 'minimal'
  })
  const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false,
    heartbeat: 2000
  })

  app.use(hotMiddleware)
  app.use(require('connect-history-api-fallback')())
  app.use(devMiddleware)

  app.use(publicPath, express.static(path))
  // app.use(join(publicPath, 'statics'), express.static(join(__dirname, '../devel-public/assets')))
}

const app = express()

log('info', `Configuring server for environment: ${process.env.NODE_ENV}...`)
app.use(helmet({
  frameguard: false // 允许iframe
}))
app.set('port', process.env.PORT || 3000)

configureDevelopment(app)
log('info', 'Configure done')
app.listen(app.get('port'), '0.0.0.0', () => log('info', `Server listening on port ${app.get('port')}...`))
