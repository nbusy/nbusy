/**
 * WebSocket server configuration.
 * Based on https://github.com/websockets/ws
 * Also uses optional bufferutil and utf-8-validate packages.
 */

const WebSocketServer = require('ws').Server
const config = require('./config')

const wss = new WebSocketServer({port: config.app.port})

wss.on('connection', function connection (ws) {
  ws.on('message', function incoming (message) {
    console.log('received: %s', message)
  })

  ws.send('something')
})

module.exports = wss
