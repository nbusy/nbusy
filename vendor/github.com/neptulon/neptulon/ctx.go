package neptulon

import (
	"encoding/json"
	"errors"
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
	if ctx.params == nil {
		return errors.New("ctx: request did not have any request parameters")
	}

	if err := json.Unmarshal(ctx.params, v); err != nil {
		return fmt.Errorf("ctx: cannot deserialize request params: %v", err)
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

	return nil
}

// ResCtx is the response context.
type ResCtx struct {
	Conn *Conn // Client connection.

	ID           string // Message ID.
	Success      bool   // If response is a success or error response.
	ErrorCode    int    // Error code (if any).
	ErrorMessage string // Error message (if any).

	result    json.RawMessage // result parameters
	errorData json.RawMessage // error data (if any)
}

func newResCtx(conn *Conn, id string, result json.RawMessage, err *resError) *ResCtx {
	r := ResCtx{
		Conn:   conn,
		ID:     id,
		result: result,
	}

	if err == nil {
		r.Success = true
		return &r
	}

	r.Success = false
	r.ErrorCode = err.Code
	r.ErrorMessage = err.Message
	r.errorData = err.Data
	return &r
}

// Result reads response result data into given object.
// Object should be passed by reference.
func (ctx *ResCtx) Result(v interface{}) error {
	if !ctx.Success {
		return errors.New("ctx: cannot read result data since server returned an error")
	}
	if ctx.result == nil {
		return errors.New("ctx: server did not return any response data")
	}

	if err := json.Unmarshal(ctx.result, v); err != nil {
		return fmt.Errorf("ctx: cannot deserialize response result: %v", err)
	}
	return nil
}

// ErrorData reads the error response data into given object.
// Object should be passed by reference.
func (ctx *ResCtx) ErrorData(v interface{}) error {
	if ctx.Success {
		return errors.New("ctx: cannot read error data since server returned a success response")
	}
	if ctx.errorData == nil {
		return errors.New("ctx: server did not return any error data")
	}

	if err := json.Unmarshal(ctx.errorData, v); err != nil {
		return fmt.Errorf("ctx: cannot deserialize error data: %v", err)
	}
	return nil
}
