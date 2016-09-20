const WebSocket = require('ws')
const jwt = require('jsonwebtoken')
const config = require('./../config/config')
const ws = require('./wss')
const seed = require('./../config/seed')

const url = `ws://127.0.0.1:${config.app.port}`

describe('ws', () => {
  beforeEach(() => {
    ws.listen(null, config.app.port)
  })

  afterEach(() => {
    ws.wss.close()
  })

  it('connect', () => {
    const token = jwt.sign({id: seed.users[0]._id}, config.app.pass)
    const ws = new WebSocket(`${url}?access_token=${token}`)

    const ping = new Promise(resolve => {
      ws.on('open', function open () {
        ws.send('ping')
        resolve()
      })
    })

    const msg = new Promise(resolve => {
      ws.on('message', function (data, flags) {
        resolve(data)
      })
    })

    return Promise.all([ping, msg])
  })
})
