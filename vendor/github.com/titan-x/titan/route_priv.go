package titan

import (
	"fmt"

	"github.com/neptulon/neptulon"
	"github.com/neptulon/neptulon/middleware"
	"github.com/titan-x/titan/client"
)

func initPrivRoutes(r *middleware.Router, q *Queue) {
	r.Request("auth.jwt", initJWTAuthHandler(q))
	r.Request("echo", middleware.Echo)
	r.Request("msg.send", initSendMsgHandler(q))
}

// Used for a client to authenticate and announce its presence.
// If there are any messages meant for this user, they are started to be sent after this call.
func initJWTAuthHandler(q *Queue) func(ctx *neptulon.ReqCtx) error {
	return func(ctx *neptulon.ReqCtx) error {
		q.SetConn(ctx.Conn.Session.Get("userid").(string), ctx.Conn.ID)
		ctx.Res = client.ACK // todo: this could rather send the remaining queue size for the client
		return ctx.Next()
	}
}

// Allows clients to send messages to each other, online or offline.
func initSendMsgHandler(q *Queue) func(ctx *neptulon.ReqCtx) error {
	return func(ctx *neptulon.ReqCtx) error {
		var sMsgs []client.Message
		if err := ctx.Params(&sMsgs); err != nil {
			return err
		}

		for _, sMsg := range sMsgs {
			uid := ctx.Conn.Session.Get("userid").(string)
			rMsgs := []client.Message{client.Message{From: uid, Message: sMsg.Message}}
			err := q.AddRequest(sMsg.To, "msg.recv", rMsgs, func(ctx *neptulon.ResCtx) error {
				var res string
				ctx.Result(&res)
				if res == client.ACK {
					// todo: send 'delivered' message to sender (as a request?) about this message (or failed, depending on output)
					// todo: q.AddRequest(uid, "msg.delivered", ... // requeue if failed or handle resends automatically in the queue type, which is prefered)
				} else {
					// todo: auto retry or "msg.failed" ?
				}
				return nil
			})

			if err != nil {
				return fmt.Errorf("route: msg.recv: failed to add request to queue with error: %v", err)
			}
		}

		ctx.Res = client.ACK
		return ctx.Next()
	}
}
