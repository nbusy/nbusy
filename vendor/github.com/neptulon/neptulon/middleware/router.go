package middleware

import "github.com/neptulon/neptulon"

// Router is a request routing middleware.
type Router struct {
	routes map[string]func(ctx *neptulon.ReqCtx) error // method name -> handler func(ctx *ReqCtx) error
}

// NewRouter creates a new router instance.
func NewRouter() *Router {
	return &Router{routes: make(map[string]func(ctx *neptulon.ReqCtx) error)}
}

// Request adds a new request route registry.
func (r *Router) Request(route string, handler func(ctx *neptulon.ReqCtx) error) {
	r.routes[route] = handler
}

// Middleware is the Neptulon middleware method.
func (r *Router) Middleware(ctx *neptulon.ReqCtx) error {
	if handler, ok := r.routes[ctx.Method]; ok {
		return handler(ctx)
	}

	return ctx.Next()
}
