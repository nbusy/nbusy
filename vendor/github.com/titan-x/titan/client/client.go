package client

import (
	"github.com/neptulon/cmap"
	"github.com/neptulon/neptulon"
)

// Client is a Titan client.
type Client struct {
	ID      string     // Randomly generated unique client connection ID.
	Session *cmap.CMap // Thread-safe data store for storing arbitrary data for this connection session.
	conn    *neptulon.Conn
}

// NewClient creates a new Client object.
func NewClient() (*Client, error) {
	c, err := neptulon.NewConn()
	if err != nil {
		return nil, err
	}

	return &Client{
		ID:      c.ID,
		Session: c.Session,
		conn:    c,
	}, nil
}

// SetDeadline set the read/write deadlines for the connection, in seconds.
func (c *Client) SetDeadline(seconds int) {
	c.conn.SetDeadline(seconds)
}

// DisconnHandler registers a function to handle disconnection event.
func (c *Client) DisconnHandler(handler func(c *Client)) {
	c.conn.DisconnHandler(func(nepc *neptulon.Conn) {
		handler(c)
	})
}

// Connect connectes to the server at given network address and starts receiving messages.
func (c *Client) Connect(addr string) error {
	return c.conn.Connect(addr)
}

// Close closes a client connection.
func (c *Client) Close() error {
	return c.conn.Close()
}
