const WebSocket = require('ws')
const httpServer = require('./http-server')
const ws = require('./ws')

describe('ws', () => {
  beforeEach(async () => {
    ws.listen(httpServer.server)
    await httpServer.listen()
  })

  afterEach(async () => {
    await httpServer.close()
    await ws.wss.close()
  })

  it('to connect', async () => {
    const ws = new WebSocket('ws://127.0.0.1:3001')

    ws.on('open', function open() {
      ws.send('ping');
    });

    ws.on('message', function(data, flags) {
      console.log(data)
    });
  })
})
