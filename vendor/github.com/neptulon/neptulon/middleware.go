package neptulon

// Middleware is the type definition for Neptulon middleware.
type Middleware interface {
	Middleware(ctx *ReqCtx) error
}
