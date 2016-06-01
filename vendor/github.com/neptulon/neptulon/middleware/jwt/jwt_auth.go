package jwt

import (
	"fmt"
	"log"

	"github.com/dgrijalva/jwt-go"
	"github.com/neptulon/neptulon"
)

type token struct {
	Token string `json:"token"`
}

// HMAC is JSON Web Token authentication using HMAC.
// If successful, token context will be store with the key "userid" in session.
// If unsuccessful, connection will be closed right away.
func HMAC(password string) func(ctx *neptulon.ReqCtx) error {
	pass := []byte(password)

	return func(ctx *neptulon.ReqCtx) error {
		// if user is already authenticated
		if _, ok := ctx.Conn.Session.GetOk("userid"); ok {
			return ctx.Next()
		}

		// if user is not authenticated.. check the JWT token
		var t token
		if err := ctx.Params(&t); err != nil {
			ctx.Conn.Close()
			return err
		}

		jt, err := jwt.Parse(t.Token, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("mw: jwt: unexpected signing method: %v", token.Header["alg"])
			}
			return pass, nil
		})

		if err != nil || !jt.Valid {
			ctx.Conn.Close()
			return fmt.Errorf("mw: jwt: invalid JWT authentication attempt: %v: %v: %v", err, ctx.Conn.RemoteAddr(), t.Token)
		}

		userID := jt.Claims["userid"].(string)
		ctx.Conn.Session.Set("userid", userID)
		log.Printf("mw: jwt: client authenticated, user: %v, conn: %v, ip: %v", userID, ctx.Conn.ID, ctx.Conn.RemoteAddr())
		return ctx.Next()
	}
}
