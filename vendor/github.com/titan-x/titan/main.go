package titan

// todo: move this into a sub directory as a tool and use Conf object to initialize Server instance
//       ideally, titan-x package should use the code from main.go here to initialize the server and
//       implement DB interfaces with google datastore package or similar

// package main
//
// import "expvar"
//
// var queueLength = expvar.NewInt("queue-length")
//
// // "google.golang.org/appengine/datastore"
// // * "google.golang.org/cloud/datastore"
// // "code.google.com/p/google-api-go-client/datastore/v1beta2"
//
// func main() {
// 	// var (
// 	// 	payload = flag.String("payload", "abc", "payload data")
// 	// 	delay   = flag.Duration("delay", 1*time.Second, "write delay")
// 	// )
// 	// flag.Parse()
// 	// todo: move this under /tools
// }
