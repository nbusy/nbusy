package titan

import (
	"log"
	"strconv"

	"github.com/titan-x/gcm/ccs"
)

func listenGCM() {
	c, err := ccs.Connect(Conf.GCM.CCSHost, Conf.GCM.SenderID, Conf.GCM.APIKey(), Conf.App.Debug)
	if err != nil {
		log.Fatalln("gcm: failed to connect to GCM CCS with error:", err)
	}

	log.Println("gcm: started")

	for {
		m, err := c.Receive()
		if err != nil {
			log.Println("gcm: error receiving message:", err)
		}

		go readHandler(m)
	}
}

func readHandler(m *ccs.InMsg) {
	t := m.Data["n.message_type"]
	if t == "" {
		log.Printf("gcm: malformed message from device: %+v\n", m)
		return
	}

	switch t {
	case "message":
		ids := m.Data["n.to"]
		if ids == "" {
			log.Printf("gcm: malformed message from device: %+v\n", m)
			return
		}

		id64, err := strconv.ParseUint(ids, 10, 32)
		if err != nil || id64 == 0 {
			log.Printf("gcm: invalid user ID specific in 'n.to' data field in message from device: %+v\n", m)
			return
		}

		// id := uint32(id64)
		// user, ok := users[id]
		// if !ok {
		// 	log.Printf("User not found in user list: %+v\n", m)
		// }
		//
		// user.Send(m.Data)
	}
}
