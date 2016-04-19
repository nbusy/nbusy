# NBusy Server

[![Build Status](https://travis-ci.org/nbusy/nbusy.svg?branch=master)](https://travis-ci.org/nbusy/nbusy)
[![GoDoc](https://godoc.org/github.com/nbusy/nbusy?status.svg)](https://godoc.org/github.com/nbusy/nbusy)

NBusy messaging server for web and mobile clients. Built on [Titan](https://github.com/titan-x) messaging server framework.

## Tech Stack

For technological and architectural overview, have a look at this [blog post](http://soygul.com/nbusy).

## Docker Build and Deployment

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

You can find all the published tags at [Docker Hub: nbusy/nbusy](https://hub.docker.com/r/nbusy/nbusy/tags/)

You can also reference the repo by URL using docker.io/nbusy/nbusy

If something goes wrong and you want to stop all containers and delete all containers & images:

```bash
# stop then delete all containers
docker stop $(docker ps -a -q)
docker rm -f $(docker ps -a -q)
# delete all images
docker rmi -f $(docker images -q)
```

## Heroku Deployment

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

`Procfile` and `app.json` are ready making this repo readily available for Heroku deployment. You can start by clicking the above button.

## License

[Apache License 2.0](LICENSE)
