const nodeExternals = require('./node-externals')
const projectExternals = {
  './assets/stats.json': 'commonjs ./assets/stats.json',
  './assets/app.server.js': 'commonjs ./app.server.js'
}

module.exports = {
  ...nodeExternals,
  ...projectExternals
}
