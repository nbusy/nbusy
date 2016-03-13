package neptulon

import (
	"encoding/json"
	"fmt"

	"github.com/neptulon/cmap"
)

// ReqCtx is the request context.
type ReqCtx struct {
	Conn    *Conn      // Client connection.
	Session *cmap.CMap // Session is a data store for storing arbitrary data within this context to communicate with other middleware handling this message.

	ID     string      // Message ID.
	Method string      // Called method.
	Res    interface{} // Response to be returned.
	Err    *ResError   // Error to be returned.

	params  json.RawMessage // request parameters
	mw      []func(ctx *ReqCtx) error
	mwIndex int
}

func newReqCtx(conn *Conn, id, method string, params json.RawMessage, mw []func(ctx *ReqCtx) error) *ReqCtx {
	return &ReqCtx{
		Conn:    conn,
		Session: cmap.New(),
		ID:      id,
		Method:  method,
		params:  params,
		mw:      mw,
	}
}

// Params reads request parameters into given object.
// Object should be passed by reference.
func (ctx *ReqCtx) Params(v interface{}) error {
	if ctx.params != nil {
		if err := json.Unmarshal(ctx.params, v); err != nil {
			return fmt.Errorf("ctx: cannot deserialize request params: %v", err)
		}
	}

	return nil
}

// Next executes the next middleware in the middleware stack.
func (ctx *ReqCtx) Next() error {
	ctx.mwIndex++

	// call next middleware in the stack, if any
	if ctx.mwIndex <= len(ctx.mw) {
		return ctx.mw[ctx.mwIndex-1](ctx)
	}

	// send the response, if any
	if ctx.Res != nil || ctx.Err != nil {
		return ctx.Conn.sendResponse(ctx.ID, ctx.Res, ctx.Err)
	}

	return fmt.Errorf("ctx: no response provided for incoming request: %v: %v", ctx.Method, ctx.ID)
}

// ResCtx is the response context.
type ResCtx struct {
	Conn *Conn // Client connection.

	ID string // Message ID.

	result json.RawMessage // result parameters
	err    *resError       // response error (if any)
}

func newResCtx(conn *Conn, id string, result json.RawMessage, err *resError) *ResCtx {
	return &ResCtx{
		Conn:   conn,
		ID:     id,
		result: result,
		err:    err,
	}
}

// Result reads response result data into given object.
// Object should be passed by reference.
func (ctx *ResCtx) Result(v interface{}) error {
	if ctx.result != nil {
		if err := json.Unmarshal(ctx.result, v); err != nil {
			return fmt.Errorf("ctx: cannot deserialize response result: %v", err)
		}
	}

	return nil
}
