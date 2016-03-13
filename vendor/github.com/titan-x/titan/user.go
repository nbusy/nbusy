package titan

// User profile.
type User struct {
	ID              string
	Email           string
	PhoneNumber     uint64
	GCMRegID        string
	APNSDeviceToken string
	Name            string
	Picture         []byte
	JWTToken        string
}
