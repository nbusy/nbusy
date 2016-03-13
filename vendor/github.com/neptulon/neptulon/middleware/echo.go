package middleware

import "github.com/neptulon/neptulon"

// Echo sends incoming messages back as is.
func Echo(ctx *neptulon.ReqCtx) error {
	// unmarshall incoming message into response directly
	if err := ctx.Params(&ctx.Res); err != nil {
		return err
	}
	return ctx.Next()
}
