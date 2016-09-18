/**
 * HTTP server configuration.
 */

const http = require('http')
const config = require('./config')

exports.server = http.createServer((req, res) => {
  res.statusCode = 426;
  res.setHeader('Content-Type', 'text/plain');
  res.end(http.STATUS_CODES[426]);
})

exports.listen = () => exports.server.listen(config.app.port, 'localhost', () => {
  if (config.app.env !== 'test') {
    console.log(`Server running at http://localhost:${config.app.port}/`);
  }
})
