package middleware

import (
	"log"
	"runtime"

	"github.com/neptulon/neptulon"
)

// Error is an error/panic handler middleware.
// Any error/panic is recovered and logged and the error response is returned to the user (auto-generated if none was set).
func Error(ctx *neptulon.ReqCtx) error {
	errored := false

	if err := ctx.Next(); err != nil {
		errored = true
		log.Printf("mw: error: error handling response: %v", err)
	}

	if err := recover(); err != nil {
		errored = true
		const size = 64 << 10
		buf := make([]byte, size)
		buf = buf[:runtime.Stack(buf, false)]
		log.Printf("mw: error: panic handling response: %v\nstack trace: %s", err, buf)
	}

	if errored {
		if ctx.Err == nil {
			ctx.Err = &neptulon.ResError{
				Code:    500,
				Message: "Internal server error.",
			}
		}

		return ctx.Next()
	}

	return nil
}
