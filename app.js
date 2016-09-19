/**
 * NBusy application entry point.
 */

const httpServer = require('./config/http-server')
const config = require('./config/config')
const mongo = require('./config/mongo')
const ws = require('./config/ws')

/**
 * Initializes a new NBusy server.
 * @param overwriteDB Overwrite existing database with the seed data. Useful for testing environment.
 */
exports.init = async function (overwriteDB) {
  await mongo.connect(config.mongo.url)
  await mongo.seed(overwriteDB)

  exports.server = httpServer.server
  ws.listen(exports.server)
  if (config.app.env !== 'test') {
    console.log('NBusy server listening on port ' + config.app.port)
  }
}

// auto init if this app is not being initialized by another module (i.e. using require('./app').init();)
if (!module.parent) {
  exports.init().catch((err) => {
    console.error(err.stack)
    process.exit(1)
  })
}
