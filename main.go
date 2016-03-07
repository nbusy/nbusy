package main

import (
	"log"

	"github.com/titan-x/titan"
)

func main() {

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
