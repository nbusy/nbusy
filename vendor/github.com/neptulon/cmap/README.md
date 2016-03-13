# CMap

[![Build Status](https://travis-ci.org/neptulon/cmap.svg?branch=master)](https://travis-ci.org/neptulon/cmap)
[![GoDoc](https://godoc.org/github.com/neptulon/cmap?status.svg)](https://godoc.org/github.com/neptulon/cmap)

Thread-safe Go map implementation suitable for concurrent access from multiple goroutines. Built on basic idea taken from: [Go maps in action #concurrency](http://blog.golang.org/go-maps-in-action#TOC_6.)

## Example

```go
import "github.com/neptulon/cmap"

m := cmap.New()
m.Set("foo", "bar")

val := m.Get("foo");
bar := val.(string)
log.Println(bar)

m.Delete("foo")
```

To see a more comprehensive example and relevant documentation, check the godocs.

## Testing

All the tests can be executed with `GORACE="halt_on_error=1" go test -v -race -cover ./...` command.

## License

[MIT](LICENSE)
