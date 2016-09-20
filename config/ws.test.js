const WebSocket = require('ws')
const jwt = require('jsonwebtoken')
const config = require('./config')
const ws = require('./ws')
const seed = require('./seed')

const url = `ws://127.0.0.1:${config.app.port}`

describe('ws', () => {
  beforeEach(() => {
    ws.listen(null, config.app.port)
  })

  afterEach(() => {
    // ws.wss.close()
  })

  it('connect', () => {
    const token = jwt.sign({id: seed.users[0]._id}, config.app.pass)
    const ws = new WebSocket(`${url}?access_token=${token}`)

    const ping = new Promise(() => {})
    ws.on('open', function open() {
      ws.send('ping');
      ping.resolve()
    });

    const msg = new Promise(() => {})
    ws.on('message', function(data, flags) {
      console.log(data)
      msg.resolve()
    });

    return Promise.all([ping, msg])
  })
})
