const WebSocket = require('ws')
const jwt = require('jsonwebtoken')
const config = require('./../config/config')
const wss = require('./wss')
const seed = require('./../config/seed')

const url = `ws://127.0.0.1:${config.app.port}`

describe('ws', () => {
  beforeEach(() => {
    wss.listen({port: config.app.port, secret: config.app.secret, log: false, msgHandler: (ws, data) => ws.send(data)})
  })

  afterEach(() => {
    wss.server.close()
  })

  it('connect', () => {
    const token = jwt.sign({id: seed.users[0]._id}, config.app.secret)
    const ws = new WebSocket(`${url}/?access_token=${token}`)

    const ping = new Promise(resolve => {
      ws.on('open', function open () {
        ws.send('ping')
        resolve()
        wss.notify('wow', {yeah: 'hiii'})
      })
    })

    const msg = new Promise(resolve => {
      ws.on('message', function (data) {
        resolve(data)
      })
    })

    return Promise.all([ping, msg])
  })
})
