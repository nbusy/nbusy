# Neptulon

[![Build Status](https://travis-ci.org/neptulon/neptulon.svg?branch=master)](https://travis-ci.org/neptulon/neptulon)
[![GoDoc](https://godoc.org/github.com/neptulon/neptulon?status.svg)](https://godoc.org/github.com/neptulon/neptulon)

Neptulon is a bidirectional RPC framework with middleware support. Communication protocol is JSON-RPC over WebSockets which is full-duplex bidirectional.

Neptulon framework is only about 400 lines of code, which makes it easy to fork, specialize, and maintain for specific purposes, if you need to.

## Getting Started

Following is a server for echoing all incoming messages as is:

```go
s := neptulon.NewServer("127.0.0.1:3000")
s.MiddlewareFunc(middleware.Echo)
s.ListenAndServe()
```

Following is a client connection to the above server. You can also use [WebSocket Test Page](http://www.websocket.org/echo.html) from your browser to connect to the server.

```go
c, _ := neptulon.NewConn()
c.Connect("ws://127.0.0.1:3000")
c.SendRequest("echo", map[string]string{"message": "Hello!"}, func(ctx *neptulon.ResCtx) error {
	var msg interface{}
	err := ctx.Result(&msg)
	fmt.Println("Server sent:", msg)
	return err
})
```

For a more comprehensive example, see [example_test.go](example_test.go) file.

## Middleware

Both the `Server` and client `Conn` types have the same middleware handler signature: `Middleware(func(ctx *ReqCtx) error)`. Since both the server and the client can send request messages to each other, you can use the same set of middleware to for both, to handle the incoming requests.

See [middleware](middleware) package to get a list of all bundled middleware.

## Client Libraries

You can connect to your Neptulon server using any programming language that has WebSocket + JSON libraries. For convenience and for reference, following client modules are provided nonetheless:

* Go: Bundled [conn.go](conn.go) file.
* Java: Package [client-java](https://github.com/neptulon/client-java). Uses OkHttp for WebSockets and GSON for JSON serialization.

## Users

[Titan](https://github.com/titan-x/titan) mobile messaging app server is written entirely using the Neptulon framework. You can visit its repo to see a complete use case of Neptulon framework.

## Testing

All the tests can be executed with `GORACE="halt_on_error=1" go test -race -cover ./...` command. Optionally you can add `-v` flag to observe all connection logs.

## License

[MIT](LICENSE)
