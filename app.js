/**
 * NBusy application entry point.
 */

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

  ws.listen(null, config.app.port)
  if (config.app.env !== 'test') {
    console.log(`NBusy server running at http://127.0.0.1:${config.app.port}/`)
  }
}

// auto init if this app is not being initialized by another module (i.e. using require('./app').init();)
if (!module.parent) {
  exports.init().catch((err) => {
    console.error(err.stack)
    process.exit(1)
  })
}
