/**
 * NBusy application entry point.
 */

const http = require('./config/http')
const config = require('./config/config')
const mongo = require('./config/mongo')
const ws = require('./config/ws')

/**
 * Initializes a new NBusy server..
 * @param overwriteDB Overwrite existing database with the seed data. Useful for testing environment.
 */
exports.init = async function (overwriteDB) {
  await mongo.connect(config.mongo.url);
  await mongo.seed(overwriteDB);

  exports.server = http.server
  ws.listen(exports.server);
  if (config.app.env !== 'test') {
    console.log('NBusy listening on port ' + config.app.port);
  }
}

// auto init if this app is not being initialized by another module (i.e. using require('./app').init();)
if (!module.parent) {
  exports.init().catch(function (err) {
    console.error(err.stack);
    process.exit(1);
  });
}
