package client

import (
	"github.com/neptulon/neptulon"
	"github.com/neptulon/neptulon/middleware"
)

// ------ Incoming Requests ---------- //

// InMsgHandler registers a handler to accept incoming messages from the server.
func (c *Client) InMsgHandler(handler func(m []Message) error) {
	r := middleware.NewRouter()
	c.conn.Middleware(r)
	r.Request("msg.recv", func(ctx *neptulon.ReqCtx) error {
		var msg []Message
		if err := ctx.Params(&msg); err != nil {
			return err
		}

		if err := handler(msg); err != nil {
			return err
		}

		ctx.Res = "ACK"
		return ctx.Next()
	})
}
