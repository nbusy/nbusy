package titan

import (
	"github.com/neptulon/neptulon"
	"github.com/neptulon/neptulon/middleware"
)

func initPubRoutes(r *middleware.Router, db DB, pass string) {
	r.Request("auth.google", initGoogleAuthHandler(db, pass))
}

func initGoogleAuthHandler(db DB, pass string) func(ctx *neptulon.ReqCtx) error {
	return func(ctx *neptulon.ReqCtx) error {
		if err := googleAuth(ctx, db, pass); err != nil {
			return err
		}
		return nil
	}
}
