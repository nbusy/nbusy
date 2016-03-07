package main

import (
	"flag"
	"log"

	"github.com/titan-x/titan"
)

const (
	addr = "127.0.0.1:3000"
)

var (
	run   = flag.Bool("run", false, "Start the NBusy server.")
	caddr = flag.String("addr", addr, "Specifies a network address to start the server on. If not specific, default will be used: "+addr)
)

func main() {
	flag.Parse()

	switch {
	case *run:
		startServer(*caddr)
	default:
		flag.PrintDefaults()
	}
}

func startServer(addr string) {
	s, err := titan.NewServer(addr)
	if err != nil {
		log.Fatalf("error creating server: %v", err)
	}
	defer s.Close()

	if err := s.ListenAndServe(); err != nil {
		log.Fatalf("error closing server: %v", err)
	}
}
