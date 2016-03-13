package middleware

import (
	"log"

	"github.com/neptulon/neptulon"
)

// Logger is an incoming/outgoing message logger.
func Logger(ctx *neptulon.ReqCtx) error {
	var v interface{}
	if err := ctx.Params(&v); err != nil {
		return err
	}

	err := ctx.Next()
	log.Printf("middleware: logger: %v: %v, in: \"%v\", out: \"%v\"", ctx.ID, ctx.Method, v, ctx.Res)
	return err
}
