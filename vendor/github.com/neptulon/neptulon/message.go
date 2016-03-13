package neptulon

import "encoding/json"

// Outgoing JSON-RPC request object representation.
type request struct {
	ID     string      `json:"id"`
	Method string      `json:"method"`
	Params interface{} `json:"params,omitempty"`
}

// Outgoing JSON-RPC response object representation.
type response struct {
	ID     string      `json:"id"`
	Result interface{} `json:"result,omitempty"`
	Error  *ResError   `json:"error,omitempty"`
}

// ResError is a JSON-RPC response error object representation for outgoing responses.
type ResError struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// Generic (request or response) JSON-RPC message representation for incoming messages.
// Initially we don't know the received message type so rely on a generic type that contains everything.
// If Method field is not empty, this is a request message, otherwise a response.
type message struct {
	ID     string          `json:"id,omitempty"`
	Method string          `json:"method,omitempty"`
	Params json.RawMessage `json:"params,omitempty"` // request params
	Result json.RawMessage `json:"result,omitempty"` // response result
	Error  *resError       `json:"error,omitempty"`  // response error
}

// Incoming JSON-RPC response error object representation.
type resError struct {
	Code    int             `json:"code"`
	Message string          `json:"message"`
	Data    json.RawMessage `json:"data,omitempty"`
}
