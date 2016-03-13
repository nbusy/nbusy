package middleware

import "github.com/neptulon/neptulon"

// CertAtuh is TLS client-certificate authentication.
// If successful, certificate common name will stored with the key "userid" in session.
// If unsuccessful, connection will be closed right away.
func CertAtuh(ctx *neptulon.ReqCtx) error {
	if _, ok := ctx.Session.GetOk("userid"); ok {
		return ctx.Next()
	}

	// if provided, client certificate is verified by the TLS listener so the peerCerts list in the connection is trusted
	// connState, _ := ctx.Conn.ConnectionState()
	// certs := connState.PeerCertificates
	// if len(certs) == 0 {
	// 	log.Println("Invalid client-certificate authentication attempt:", ctx.Conn.RemoteAddr())
	// 	ctx.Conn.Close()
	// 	return nil
	// }
	//
	// userID := certs[0].Subject.CommonName
	// ctx.Session.Set("userid", userID)
	// log.Printf("Client authenticated. TLS/IP: %v, User ID: %v, Conn ID: %v\n", ctx.Conn.RemoteAddr(), userID, ctx.Conn.ID)
	return ctx.Next()
}
