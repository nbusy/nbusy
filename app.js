/**
 * NBusy application entry point.
 */

const config = require('./config/config')
const mongo = require('./config/mongo')

/**
 * Initializes a new NBusy server.
 * @param overwriteDB Overwrite existing database with the seed data. Useful for testing environment.
 */
exports.init = async function (overwriteDB) {
  await mongo.connect(config.mongo.url)
  await mongo.seed(overwriteDB)
}

// auto init if this app is not being initialized by another module (i.e. using require('./app').init();)
if (!module.parent) {
  exports.init().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
