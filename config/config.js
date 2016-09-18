/**
 * Environment variables and application configuration.
 */

const path = require('path')
const _ = require('lodash')

function init () {
  const baseConfig = {
    app: {
      root: path.normalize(path.join(__dirname, '/..')),
      env: process.env.NODE_ENV,
      secret: process.env.SECRET || 'secret key' /* used in signing the jwt tokens */,
      pass: process.env.PASS || 'pass' /* generic password for seed user logins */
    }
  }

  // environment specific config overrides
  const platformConfig = {
    dev: {
      app: {
        port: 3000
      },
      mongo: {
        url: 'mongodb://localhost:27017/nbusy-dev'
      }
    },

    test: {
      app: {
        port: 3001
      },
      mongo: {
        url: 'mongodb://localhost:27017/nbusy-test'
      }
    },

    prod: {
      app: {
        port: process.env.PORT || 3000
      },
      mongo: {
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/nbusy'
      }
    }
  }

  // override the base configuration with the platform specific values
  module.exports = _.merge(baseConfig, platformConfig[process.env.NODE_ENV || (baseConfig.app.env = 'dev')])
  module.exports.init = init
  return module.exports
}

init()
