# Titan

[![Build Status](https://travis-ci.org/titan-x/titan.svg?branch=master)](https://travis-ci.org/titan-x/titan)
[![GoDoc](https://godoc.org/github.com/titan-x/titan?status.svg)](https://godoc.org/github.com/titan-x/titan)

Titan is a messaging server for delivering chat messages to mobile devices and browsers. For each delivery target, the server uses different protocol. i.e. GCM for Android apps, WebSocket for browsers, etc. The server is completely written in Go and makes huge use of goroutines and channels. Client server communication is full-duplex bidirectional.

## Getting Started

```go
import "github.com/titan-x/titan"

s, _ := titan.NewServer(":80")
s.ListenAndServe()
```

An example is deployed at [wss://titan-x.herokuapp.com](wss://titan-x.herokuapp.com). You can use the provided Titan [client](/client) and start experimenting right away.

You can also use the provided command line tool to start a Titan server:

```bash
cd github.com/titan-x/titan
go install -v ./cmd/titan
titan
```

## Architecture

Messaging server utilizes device specific delivery infrastructure for notifications and messages; GCM for Android, APNS for iOS, and WebSocket for the Web browsers. Any message too big for GCM/APNS size limit will be notified but will be delivered over WebSocket.

Following is the simplified server architecture:

```
+--------------------------------------------------------+
|  GCM  |  APNS  |  JSON-RPC over WebSockets (Neptulon)  |
+--------------------------------------------------------+
|                      RPC Methods                       |
+--------------------------------------------------------+
|        User Database      |       Message Queue        |
+--------------------------------------------------------+
```

## Client-Server Protocol

(Titan server is entirely built on top of [Neptulon](https://github.com/neptulon/neptulon) framework. You can browse Neptulon repository to get more in-depth info.)

Client server communication protocol is based on [JSON RPC](http://www.jsonrpc.org/specification) 2.0 specs. Both mobile devices and the Web browsers utilizes the WebSocket endpoint. All connections are secured with TLS.

## Client Authentication

First-time registration is done through Google+ OAuth 2.0 flow. After a successful registration, the connecting device receives a JSON Web Token to be used for successive connections.

## Typical Client-Server Communication

Client-server communication sequence is pretty similar to that of XMPP, except we are using JSON RPC packaging for messages.

```
[Client]                    [Server]
+                                  +
|<<<------GCM Notification---------|
|                                  |
|                                  |
|------------[auth.jwt]--------->>>|
|                                  |
|<<<-----------[ACK]---------------|
|                                  |
|                                  |
|<<<---------[msg.recv]------------|
|                                  |
|--------------[ACK]------------>>>|
|                                  |
|                                  |
|------------[msg.send]--------->>>|
|                                  |
|<<<-----------[ACK]---------------|
+                                  +
```

Any message that was not acknowledged by the client will be delivered again (hence at-least-once delivery principle). Client implementations will be ready to handle occasional duplicate deliveries of messages by the server. Message IDs will remain the same for duplicates.

## Users

[NBusy](https://github.com/nbusy/nbusy) server is running on top of Titan server. You can visit its repo to see a complete use case of Titan server.

## Testing

All the tests can be executed with `GORACE="halt_on_error=1" go test -race -cover ./...` command. Optionally you can add `-v` flag to observe all connection logs. Integration tests require environment variables defined in the next section. If they are missing, integration tests are skipped.

## Environment Variables

Following environment variables needs to be present on any dev or production environment:

```bash
export GOOGLE_API_KEY=
export GOOGLE_PREPROD_API_KEY=
```

## Logging and Metrics

Only actionable events are logged (i.e. server started, client connected on IP ..., client disconnected, etc.). You can use logs as event sources. Anything else is considered telemetry and exposed with `expvar`. Queue lengths, active connection/request counts, performance metrics, etc. Metrics are exposed via HTTP at /debug/vars in JSON format.

## Performance Notes

The messaging server is designed to make max usage of available CPU resources. However exceeding 100% CPU usage will cause a memory usage spike as marshalled/unmarshalled messages and other allocated byte buffers will have to reside in memory much longer. Ideally, 95% CPU usage should trigger the clustering mechanism which should spawn more server instances. Currently there is no clustering support built-in, but it is a priority.

## Command Line Tool

You can install `titan` command to `$GOPATH/bin` directory to be universally available from your shell using following:

```bash
go install -v ./cmd/titan
titan
```

Or you can simply use `go run cmd/titan/main.go` without installing.


## Docker Build and Deployment

To build and run a Docker container:

```bash
docker build -t titan .
docker run --publish 80:80 --name titan --rm titan
```

The --publish flag tells docker to publish the container's port 80 on the external port 80.
The --name flag gives our container a predictable name to make it easier to work with.
The --rm flag tells docker to remove the container image when the Titan server exits.

Now you can browse to the [WebSocket Test Page](http://www.websocket.org/echo.html) and type in `ws://192.168.99.100:80` (you might need to replace the IP with the IP of you Docker host depending on your system).

One you're done, shut down the running container from another terminal window:

```bash
docker stop titan
```

## Docker Registry

You can pull prebuilt Titan Docker image via:

```bash
docker pull titanx/titan
```

You can find all the published tags at [Docker Hub: titan-x/titan](https://hub.docker.com/r/titan-x/titan/tags/)

You can also reference the repo by URL using docker.io/titan-x/titan

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

A sample deployment is at [wss://titan-x.herokuapp.com](wss://titan-x.herokuapp.com) where you can connect with any Titan client.

## License

[MIT](LICENSE)
