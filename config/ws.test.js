const WebSocket = require('ws')
const config = require('./config')
const ws = require('./ws')

const url = 'ws://127.0.0.1:' + config.app.port

describe('ws', () => {
  beforeEach(() => {
    ws.listen(null, config.app.port)
  })

  afterEach(() => {
    // ws.wss.close()
  })

  it('connect', () => {
    const ws = new WebSocket(url)

    ws.on('open', function open() {
      ws.send('ping');
    });

    ws.on('message', function(data, flags) {
      console.log(data)
    });
  })
})
