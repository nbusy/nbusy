[![NBusy](https://raw.github.com/nbusy/nbusy/master/client/images/nbusy_large.png)](http://nbusy.com/)

[![Build Status](https://travis-ci.org/nbusy/nbusy.svg?branch=master)](https://travis-ci.org/nbusy/nbusy)
[![GoDoc](https://godoc.org/github.com/nbusy/nbusy?status.svg)](https://godoc.org/github.com/nbusy/nbusy)

NBusy messaging server for web and mobile clients. Built on [Titan](https://github.com/titan-x) messaging server framework.

## Tech Stack

For technological and architectural overview, have a look at this [blog post](http://www.soygul.com/projects/nbusy/).

## Docker

To build and run a Docker container:

```bash
docker build -t nbusy .
docker run --publish 80:80 --name nbusy --rm nbusy
```

The --publish flag tells docker to publish the container's port 80 on the external port 80.
The --name flag gives our container a predictable name to make it easier to work with.
The --rm flag tells docker to remove the container image when the NBusy server exits.

Now you can browse to the [WebSocket Test Page](http://www.websocket.org/echo.html) and type in `ws://192.168.99.100:80` (you might need to replace the IP with the IP of you Docker host depending on your system).

One you're done, shut down the running container from another terminal window:

```bash
docker stop nbusy
```

## Docker Registry

You can pull prebuilt NBusy Docker image via:

```bash
docker pull nbusy/nbusy
```

## License

[Apache License 2.0](LICENSE)
