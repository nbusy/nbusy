'use strict';

/**
 * Environment variables and application configuration.
 */

var path = require('path'),
    _ = require('lodash');

var baseConfig = {
  app: {
    root: path.normalize(__dirname + '/../..'),
    env: process.env.NODE_ENV,
    secret: process.env.SECRET /* used in signing the jwt tokens */,
    pass: process.env.PASS /* generic password for seed user logins */
  },
  oauth: {
    facebook: {
      clientSecret: process.env.FACEBOOK_SECRET
    },
    google: {
      clientSecret: process.env.GOOGLE_SECRET
    }
  }
};

// environment specific config overrides
var platformConfig = {
  development: {
    app: {
      port: 3000,
      secret: 'secret key',
      pass: 'pass'
    },
    mongo: {
      url: 'mongodb://localhost:27017/nbusy-dev'
    },
    oauth: {
      facebook: {
        clientId: '194890683879045',
        callbackUrl: 'http://localhost:3000/signin/facebook/callback'
      },
      google: {
        clientId: '218602439235-6g09g0ap6i8v25v3rel49rtqjcu9ppj0.apps.googleusercontent.com',
        callbackUrl: 'http://localhost:3000/signin/google/callback'
      }
    }
  },

  test: {
    app: {
      port: 3001,
      secret: 'secret key',
      pass: 'pass'
    },
    mongo: {
      url: 'mongodb://localhost:27017/nbusy-test'
    }
  },

  production: {
    app: {
      port: process.env.PORT || 3000,
      cacheTime: 7 * 24 * 60 * 60 * 1000 /* default caching time (7 days) for static files, calculated in milliseconds */
    },
    mongo: {
      url: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/nbusy'
    },
    oauth: {
      facebook: {
        clientId: '194890683879045',
        callbackUrl: 'http://nbusy.com/signin/facebook/callback'
      },
      google: {
        clientId: '218602439235-6g09g0ap6i8v25v3rel49rtqjcu9ppj0.apps.googleusercontent.com',
        callbackUrl: 'http://nbusy.com/signin/google/callback'
      }
    }
  }
};

// override the base configuration with the platform specific values
module.exports = _.merge(baseConfig, platformConfig[baseConfig.app.env || (baseConfig.app.env = 'development')]);
