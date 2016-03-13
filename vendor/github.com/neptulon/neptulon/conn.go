package neptulon

import (
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"runtime"
	"sync"
	"sync/atomic"
	"time"

	"github.com/neptulon/cmap"
	"github.com/neptulon/shortid"

	"golang.org/x/net/websocket"
)

// Conn is a client connection.
type Conn struct {
	ID             string     // Randomly generated unique client connection ID.
	Session        *cmap.CMap // Thread-safe data store for storing arbitrary data for this connection session.
	middleware     []func(ctx *ReqCtx) error
	resRoutes      *cmap.CMap // message ID (string) -> handler func(ctx *ResCtx) error : expected responses for requests that we've sent
	ws             *websocket.Conn
	wg             sync.WaitGroup
	deadline       time.Duration
	isClientConn   bool
	connected      atomic.Value
	disconnHandler func(c *Conn)
}

// NewConn creates a new Conn object.
func NewConn() (*Conn, error) {
	id, err := shortid.UUID()
	if err != nil {
		return nil, err
	}

	return &Conn{
		ID:             id,
		Session:        cmap.New(),
		resRoutes:      cmap.New(),
		deadline:       time.Second * time.Duration(300),
		disconnHandler: func(c *Conn) {},
	}, nil
}

// SetDeadline set the read/write deadlines for the connection, in seconds.
// Default value for read/write deadline is 300 seconds.
func (c *Conn) SetDeadline(seconds int) {
	c.deadline = time.Second * time.Duration(seconds)
}

// Middleware registers middleware to handle incoming request messages.
func (c *Conn) Middleware(middleware ...Middleware) {
	for _, m := range middleware {
		c.MiddlewareFunc(m.Middleware)
	}
}

// MiddlewareFunc registers middleware function to handle incoming request messages.
func (c *Conn) MiddlewareFunc(middleware ...func(ctx *ReqCtx) error) {
	c.middleware = append(c.middleware, middleware...)
}

// DisconnHandler registers a function to handle disconnection event.
func (c *Conn) DisconnHandler(handler func(c *Conn)) {
	c.disconnHandler = handler
}

// Connect connects to the given WebSocket server.
// addr should be formatted as ws://host:port -or- wss://host:port (i.e. ws://127.0.0.1:3000 -or- wss://localhost:3000)
func (c *Conn) Connect(addr string) error {
	ws, err := websocket.Dial(addr, "", "http://localhost")
	if err != nil {
		return err
	}
	if err := c.setConn(ws); err != nil {
		return err
	}

	c.isClientConn = true
	c.wg.Add(1)
	go func() {
		defer recoverAndLog(c, &c.wg)
		c.startReceive()
	}()
	time.Sleep(time.Millisecond) // give receive goroutine a few cycles to start
	return nil
}

// RemoteAddr returns the remote network address.
func (c *Conn) RemoteAddr() net.Addr {
	if c.ws == nil {
		return nil
	}

	return c.ws.RemoteAddr()
}

// SendRequest sends a JSON-RPC request through the connection with an auto generated request ID.
// resHandler is called when a response is returned.
func (c *Conn) SendRequest(method string, params interface{}, resHandler func(res *ResCtx) error) (reqID string, err error) {
	id, err := shortid.UUID()
	if err != nil {
		return "", err
	}

	req := request{ID: id, Method: method, Params: params}
	if err = c.send(req); err != nil {
		return "", err
	}

	c.resRoutes.Set(req.ID, resHandler)
	return id, nil
}

// SendRequestArr sends a JSON-RPC request through the connection, with array params and auto generated request ID.
// resHandler is called when a response is returned.
func (c *Conn) SendRequestArr(method string, resHandler func(res *ResCtx) error, params ...interface{}) (reqID string, err error) {
	return c.SendRequest(method, params, resHandler)
}

// Close closes the connection.
func (c *Conn) Close() error {
	c.connected.Store(false)
	if c.ws != nil {
		c.ws.Close()
	}
	return nil
}

// Wait waits for all message/connection handler goroutines to exit.
func (c *Conn) Wait() {
	c.wg.Wait()
}

// SendResponse sends a JSON-RPC response message through the connection.
func (c *Conn) sendResponse(id string, result interface{}, err *ResError) error {
	return c.send(response{ID: id, Result: result, Error: err})
}

// Send sends the given message through the connection.
func (c *Conn) send(msg interface{}) error {
	if !c.connected.Load().(bool) {
		return errors.New("use of closed connection")
	}

	return websocket.JSON.Send(c.ws, msg)
}

// Receive receives message from the connection.
func (c *Conn) receive(msg *message) error {
	if !c.connected.Load().(bool) {
		return errors.New("use of closed connection")
	}

	return websocket.JSON.Receive(c.ws, &msg)
}

// Reuse an established websocket.Conn.
func (c *Conn) setConn(ws *websocket.Conn) error {
	c.ws = ws
	c.connected.Store(true)
	if err := ws.SetDeadline(time.Now().Add(c.deadline)); err != nil {
		return fmt.Errorf("conn: error while setting websocket connection deadline: %v", err)
	}
	return nil
}

// startReceive starts receiving messages. This method blocks and does not return until the connection is closed.
func (c *Conn) startReceive() {
	defer func() {
		c.Close()
		c.disconnHandler(c)
	}()

	for {
		var m message
		err := c.receive(&m)
		if err != nil {
			// if we closed the connection
			if !c.connected.Load().(bool) {
				log.Printf("conn: closed %v: %v", c.ID, c.RemoteAddr())
				break
			}

			// if peer closed the connection
			if err == io.EOF {
				log.Printf("conn: peer disconnected %v: %v", c.ID, c.RemoteAddr())
				break
			}

			log.Printf("conn: error while receiving message: %v", err)
			break
		}

		// if the message is a request
		if m.Method != "" {
			c.wg.Add(1)
			go func() {
				defer recoverAndLog(c, &c.wg)
				if err := newReqCtx(c, m.ID, m.Method, m.Params, c.middleware).Next(); err != nil {
					log.Printf("conn: error while handling request: %v", err)
					c.Close()
				}
			}()

			continue
		}

		// if the message is not a JSON-RPC message
		if m.ID == "" || (m.Result == nil && m.Error == nil) {
			log.Printf("conn: received an unknown message %v: %v, %v", c.ID, c.RemoteAddr(), m)
			break
		}

		// if the message is a response
		if resHandler, ok := c.resRoutes.GetOk(m.ID); ok {
			c.wg.Add(1)
			go func() {
				defer recoverAndLog(c, &c.wg)
				err := resHandler.(func(ctx *ResCtx) error)(newResCtx(c, m.ID, m.Result, m.Error))
				c.resRoutes.Delete(m.ID)
				if err != nil {
					log.Printf("conn: error while handling response: %v", err)
					c.Close()
				}
			}()
		} else {
			log.Printf("conn: error while handling response: got response to a request with unknown ID: %v", m.ID)
			break
		}
	}
}

func recoverAndLog(c *Conn, wg *sync.WaitGroup) {
	defer wg.Done()
	if err := recover(); err != nil {
		const size = 64 << 10
		buf := make([]byte, size)
		buf = buf[:runtime.Stack(buf, false)]
		log.Printf("conn: panic handling response %v: %v\n%s", c.RemoteAddr(), err, buf)
	}
}
