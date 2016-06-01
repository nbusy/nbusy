package titan

import "time"

// User profile.
type User struct {
	ID              string
	Registered      time.Time
	Email           string
	PhoneNumber     uint64
	GCMRegID        string
	APNSDeviceToken string
	Name            string
	Picture         []byte
	JWTToken        string
}
