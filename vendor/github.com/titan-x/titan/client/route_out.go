package client

import "github.com/neptulon/neptulon"

// ------ Outgoing Requests ---------- //

// JWTAuth authenticates using the given JWT token.
// This also announces availability to the server, so server can start sending us pending messages.
func (c *Client) JWTAuth(jwtToken string, handler func(ack string) error) error {
	_, err := c.conn.SendRequest("auth.jwt", map[string]string{"token": jwtToken}, func(ctx *neptulon.ResCtx) error {
		var ack string
		if err := ctx.Result(&ack); err != nil {
			return err
		}
		return handler(ack)
	})

	return err
}

// SendMessages sends a batch of messages to the server.
func (c *Client) SendMessages(m []Message, handler func(ack string) error) error {
	_, err := c.conn.SendRequest("msg.send", m, func(ctx *neptulon.ResCtx) error {
		var ack string
		if err := ctx.Result(&ack); err != nil {
			return err
		}
		return handler(ack)
	})

	return err
}

// Echo sends a message to server echo endpoint.
// This is meant to be used for testing connectivity.
func (c *Client) Echo(m interface{}, msgHandler func(msg *Message) error) error {
	_, err := c.conn.SendRequest("echo", m, func(ctx *neptulon.ResCtx) error {
		var msg Message
		if err := ctx.Result(&msg); err != nil {
			return err
		}
		if err := msgHandler(&msg); err != nil {
			return err
		}
		return nil
	})

	return err
}
