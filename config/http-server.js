/**
 * HTTP server configuration.
 */

const promisifyAll = require('bluebird').promisifyAll
const http = promisifyAll(require('http'))
const config = require('./config')

exports.server = http.createServer((req, res) => {
  // todo: do authentication here

  // currently this is a websocket only server so always reply with upgrade-required
  res.statusCode = 426
  res.end()
})

exports.listen = async () => {
  await exports.server.listenAsync(config.app.port, '127.0.0.1')
  if (config.app.env !== 'test') {
    console.log(`Server running at http://127.0.0.1:${config.app.port}/`)
  }
}

exports.close = async () => {
  await exports.server.closeAsync()
}
