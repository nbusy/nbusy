// Package neptulon is a RPC framework with middleware support.
package neptulon

import (
	"crypto/tls"
	"crypto/x509"
	"encoding/pem"
	"errors"
	"fmt"
	"log"
	"net"
	"net/http"
	"net/url"
	"sync"
	"sync/atomic"

	"github.com/neptulon/cmap"

	"golang.org/x/net/websocket"
)

// Server is a Neptulon server.
type Server struct {
	addr           string
	conns          *cmap.CMap // conn ID -> *Conn
	middleware     []func(ctx *ReqCtx) error
	listener       net.Listener
	wsConfig       websocket.Config
	wg             sync.WaitGroup
	running        atomic.Value
	disconnHandler func(c *Conn)
}

// NewServer creates a new Neptulon server.
// addr should be formatted as host:port (i.e. 127.0.0.1:3000)
func NewServer(addr string) *Server {
	s := &Server{
		addr:           addr,
		conns:          cmap.New(),
		disconnHandler: func(c *Conn) {},
	}
	s.running.Store(false)
	return s
}

// UseTLS enables Transport Layer Security for the connections.
// cert, key = Server certificate/private key pair.
// clientCACert = Optional certificate for verifying client certificates.
// All certificates/private keys are in PEM encoded X.509 format.
func (s *Server) UseTLS(cert, privKey, clientCACert []byte) error {
	tlsCert, err := tls.X509KeyPair(cert, privKey)
	if err != nil {
		return fmt.Errorf("failed to parse the server certificate or the private key: %v", err)
	}

	c, _ := pem.Decode(cert)
	if tlsCert.Leaf, err = x509.ParseCertificate(c.Bytes); err != nil {
		return fmt.Errorf("failed to parse the server certificate: %v", err)
	}

	pool := x509.NewCertPool()
	ok := pool.AppendCertsFromPEM(clientCACert)
	if !ok {
		return fmt.Errorf("failed to parse the CA certificate: %v", err)
	}

	s.wsConfig.TlsConfig = &tls.Config{
		Certificates: []tls.Certificate{tlsCert},
		ClientCAs:    pool,
		ClientAuth:   tls.VerifyClientCertIfGiven,
	}

	return nil
}

// Middleware registers middleware to handle incoming request messages.
func (s *Server) Middleware(middleware ...Middleware) {
	for _, m := range middleware {
		s.MiddlewareFunc(m.Middleware)
	}
}

// MiddlewareFunc registers middleware function to handle incoming request messages.
func (s *Server) MiddlewareFunc(middleware ...func(ctx *ReqCtx) error) {
	s.middleware = append(s.middleware, middleware...)
}

// DisconnHandler registers a function to handle client disconnection events.
func (s *Server) DisconnHandler(handler func(c *Conn)) {
	s.disconnHandler = handler
}

// ListenAndServe starts the Neptulon server. This function blocks until server is closed.
func (s *Server) ListenAndServe() error {
	mux := http.NewServeMux()
	mux.Handle("/", websocket.Server{
		Config:  s.wsConfig,
		Handler: s.wsConnHandler,
		Handshake: func(config *websocket.Config, req *http.Request) error {
			s.wg.Add(1)                                  // todo: this needs to happen inside the gorotune executing the Start method and not the request goroutine or we'll miss some edge connections
			config.Origin, _ = url.Parse(req.RemoteAddr) // we're interested in remote address and not origin header text
			return nil
		},
	})

	l, err := net.Listen("tcp", s.addr)
	if err != nil {
		return fmt.Errorf("failed to create TLS listener on network address %v with error: %v", s.addr, err)
	}
	s.listener = l

	log.Printf("server: started %v", s.addr)
	s.running.Store(true)
	err = http.Serve(l, mux)
	if !s.running.Load().(bool) {
		return nil
	}
	return err
}

// SendRequest sends a JSON-RPC request through the connection denoted by the connection ID with an auto generated request ID.
// resHandler is called when a response is returned.
func (s *Server) SendRequest(connID string, method string, params interface{}, resHandler func(ctx *ResCtx) error) (reqID string, err error) {
	if !s.running.Load().(bool) {
		return "", errors.New("use of closed server")
	}

	if conn, ok := s.conns.GetOk(connID); ok {
		return conn.(*Conn).SendRequest(method, params, resHandler)
	}

	return "", fmt.Errorf("connection with requested ID: %v does not exist", connID)
}

// SendRequestArr sends a JSON-RPC request through the connection denoted by the connection ID, with array params and auto generated request ID.
// resHandler is called when a response is returned.
func (s *Server) SendRequestArr(connID string, method string, resHandler func(ctx *ResCtx) error, params ...interface{}) (reqID string, err error) {
	return s.SendRequest(connID, method, params, resHandler)
}

// Close closes the network listener and the active connections.
func (s *Server) Close() error {
	if !s.running.Load().(bool) {
		return nil
	}
	s.running.Store(false)
	err := s.listener.Close()

	// close all active connections discarding any read/writes that is going on currently
	s.conns.Range(func(c interface{}) {
		c.(*Conn).Close()
	})

	if err != nil {
		return fmt.Errorf("an error occured before or while stopping the server: %v", err)
	}

	s.wg.Wait()
	log.Printf("server: stopped %v", s.addr)
	return nil
}

// Wait waits for all message/connection handler goroutines in all connections to exit.
func (s *Server) Wait() {
	s.conns.Range(func(c interface{}) {
		c.(*Conn).Wait(180)
	})
}

// wsHandler handles incoming websocket connections.
func (s *Server) wsConnHandler(ws *websocket.Conn) {
	c, err := NewConn()
	if err != nil {
		log.Printf("server: error while accepting connection: %v", err)
		return
	}
	defer recoverAndLog(c, &s.wg)
	c.MiddlewareFunc(s.middleware...)

	log.Printf("server: client connected %v: %v", c.ID, ws.RemoteAddr())

	s.conns.Set(c.ID, c)
	c.setConn(ws)
	c.startReceive()
	s.conns.Delete(c.ID)
	s.disconnHandler(c)
}
