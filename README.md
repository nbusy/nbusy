[![NBusy](https://raw.github.com/nbusy/nbusy/master/client/images/nbusy_large.png)](http://nbusy.com/)

[![Build Status](https://travis-ci.org/nbusy/nbusy.svg?branch=master)](https://travis-ci.org/nbusy/nbusy)

Social networking platform built with [Angular](http://angularjs.org/) and [Node.js](http://nodejs.org/).

## Tech Stack
For technological and architectural overview, have a look at this [blog post](http://www.soygul.com/projects/nbusy/).

## Project Template
This project uses [KOAN](https://github.com/soygul/koan) (Koa, AngularJS, Node.js) Stack as the project template.

## Heroku Deployment
Apart from the usual KOAN Heroku deployment steps, following are also needed:

```bash
heroku config:add NODE_ENV=production
heroku config:add SECRET=jwt_secret
heroku config:add PASS=seed_pass
heroku config:add FACEBOOK_SECRET=facebook_oauth_secret
heroku config:add GOOGLE_SECRET=google_oauth_secret
```