package middleware

import (
	"log"

	"github.com/neptulon/neptulon"
)

// CustResLogDataKey is the key to be used in session data store to put any custom response log data.
const CustResLogDataKey = "CustResLogData"

// Logger is an incoming/outgoing message logger.
func Logger(ctx *neptulon.ReqCtx) error {
	var v interface{}
	ctx.Params(&v)

	err := ctx.Next()

	var res interface{}
	if res = ctx.Session.Get(CustResLogDataKey); res == nil {
		res = ctx.Res
		if res == nil {
			res = ctx.Err
		}
	}

	log.Printf("mw: logger: %v: %v, in: \"%v\", out: \"%#v\"", ctx.ID, ctx.Method, v, res)

	return err
}
