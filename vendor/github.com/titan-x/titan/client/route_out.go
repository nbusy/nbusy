package client

import (
	"fmt"

	"github.com/neptulon/neptulon"
)

// ------ Outgoing Requests ---------- //

// GoogleAuth authenticates using the given Google OAuth token and retrieves a JWT token.
// This also announces availability to the server, so server can start sending us pending messages.
func (c *Client) GoogleAuth(oauthToken string, handler func(jwtToken string) error) error {
	_, err := c.conn.SendRequest("auth.google", map[string]string{"token": oauthToken}, func(ctx *neptulon.ResCtx) error {
		var jwtToken map[string]string
		if err := ctx.Result(&jwtToken); err != nil {
			return fmt.Errorf("client: auth.google: error reading response: %v", err)
		}
		return handler(jwtToken["token"])
	})

	if err != nil {
		return fmt.Errorf("client: auth.google: error sending request: %v", err)
	}

	return nil
}

// JWTAuth authenticates using the given JWT token.
// This also announces availability to the server, so server can start sending us pending messages.
func (c *Client) JWTAuth(jwtToken string, handler func(ack string) error) error {
	_, err := c.conn.SendRequest("auth.jwt", map[string]string{"token": jwtToken}, func(ctx *neptulon.ResCtx) error {
		var ack string
		if err := ctx.Result(&ack); err != nil {
			return fmt.Errorf("client: auth.jwt: error reading response: %v", err)
		}
		return handler(ack)
	})

	if err != nil {
		return fmt.Errorf("client: auth.jwt: error sending request: %v", err)
	}

	return nil
}

// SendMessages sends a batch of messages to the server.
func (c *Client) SendMessages(m []Message, handler func(ack string) error) error {
	_, err := c.conn.SendRequest("msg.send", m, func(ctx *neptulon.ResCtx) error {
		var ack string
		if err := ctx.Result(&ack); err != nil {
			return fmt.Errorf("client: msg.send: error reading response: %v", err)
		}
		return handler(ack)
	})

	if err != nil {
		return fmt.Errorf("client: msg.send: error sending request: %v", err)
	}

	return nil
}

// Echo sends a message to server echo endpoint.
// This is meant to be used for testing connectivity.
func (c *Client) Echo(m interface{}, msgHandler func(msg *Message) error) error {
	_, err := c.conn.SendRequest("echo", m, func(ctx *neptulon.ResCtx) error {
		var msg Message
		if err := ctx.Result(&msg); err != nil {
			return fmt.Errorf("client: echo: error reading response: %v", err)
		}
		return msgHandler(&msg)
	})

	if err != nil {
		return fmt.Errorf("client: echo: error sending request: %v", err)
	}

	return nil
}
