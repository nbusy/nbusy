const wss = require('./wss')
const config = require('./config')

describe('wss', () => {
  it('connects', () => {
    var WebSocket = require('ws');
    var ws = new WebSocket(`http://localhost:${config.app.port}`);

    ws.on('open', function open() {
      ws.send('something');
    });

    ws.on('message', function(data, flags) {
      console.log('client received: %s', data)
    });

    ws.close()

    wss.close()
  })
})

