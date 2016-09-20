/**
 * WebSocket server for serving routes defined in /routes directory.
 */

const WebSocketServer = require('ws').Server
const url = require('url')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

/**
 * Dictionary (array of arrays) to math connected user IDs with connected clients (i.e. one user might be connected from multiple devices).
 * Array index is the client ID and the stored value is also an array with socket client objects. i.e. clients[33452234]: [ws1, ws2, ws3...]
 */
exports.clients = []

/**
 * Creates and attaches a WebSocket server to a given HTTP server with the same host URI.
 * @param server - Node.js HTTP server instance.
 * @param port - If no HTTP server instance is provided, one will be created on this port.
 * @param secret - Secret used for decrypting JWT tokens.
 * @param log - Enables client conn/disconn event logging.
 * @param msgHandler - Incoming message handler function
 * @returns {WebSocketServer}
 */
exports.listen = ({server, port = 3000, secret = 'secret', log = true, msgHandler = (ws, data) => {}}) => {
  // create a new WebSocket server and start listening on the same port as the given http server but with ws:// protocol
  exports.server = new WebSocketServer({
    server: server,
    port: port,
    verifyClient: (info) => {
      // validate the connecting client's access token
      // validator function attaches user details to the request object if token is valid
      const query = url.parse(info.req.url, true).query
      const accessToken = query.access_token

      // attach the user info to the request context if the token is valid
      try {
        info.req.user = jwt.verify(accessToken, secret)
      } catch (e) {
      }

      return info.req.user
    }
  })

  // WebSocket event that is fired when a new client is validated and connected
  exports.server.on('connection', (ws) => {
    const user = ws.upgradeReq.user
    log && console.log('A new WebSocket client connected with ID: ' + user.id)

    // associate connecting user ID with WebSocket connection in the clients dictionary
    if (exports.clients[user.id]) {
      exports.clients[user.id].push(ws)
    } else {
      exports.clients[user.id] = [ws]
    }

    ws.on('close', function () {
      log && console.log('A WebSocket client with ID: ' + user.id + ' disconnected.')
      if (exports.clients[user.id].length === 1) {
        exports.clients[user.id] = null // exports.clients.splice(user.id, 1); // this is the correct way but this also shifts all elements indexes which spoils the design here..
      } else {
        const index = exports.clients[user.id].indexOf(ws)
        exports.clients[user.id].splice(index, 1)
      }
    })

    ws.on('error', function (err) {
      console.log('A WebSocket error occurred: %s', err)
    })

    ws.on('message', function (data) {
      msgHandler(ws, data)
    })
  })

  return exports.server
}

/**
 * A JSON-RPC 2.0 implementation over WebSockets. Sends a one way notifications to all designated recipients with given data and method.
 * @param recipients - Array of user IDs to send the data to. Only the online clients receive the data out of the entire given recipient list. If omitted, all users will receive the message.
 * @param method - Remote method to execute in the connected client.
 * @param params - Array or object containing method parameters as defined in JSON-RPC 2.0 specs.
 */
exports.notify = (recipients, method, params) => {
  if (!Array.isArray(recipients)) {
    params = method
    method = recipients
    recipients = _.keys(exports.clients)
  }
  const data = JSON.stringify({jsonrpc: '2.0', method: method, params: params})

  // send the data to only the online recipients
  var send = function (client) {
    client.send(data, function (err) {
      // if error is null, the send has been completed
      if (err) {
        console.log('A WebSocket error occurred: %s', err)
      }
    })
  }

  for (var i = 0; i < recipients.length; i++) {
    const recipient = recipients[i]
    const onlineClients = exports.clients[recipient]
    if (onlineClients) {
      onlineClients.forEach(send)
    }
  }
}
