/**
 * Babel-register entry point.
 * We need this since node.js doesn't support async/await yet.
 */

require('babel-register')

const app = require('./app')

app.init()
