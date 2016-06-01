package titan

import "strconv"

// DB wraps all database related functions.
type DB interface {
	UserDB
}

// todo: db.GetByMail is not good, either use udb.GetByMail -or- db.Users.GetByMail

// UserDB presists user information in database.
type UserDB interface {
	GetByID(id string) (*User, bool)
	GetByMail(mail string) (*User, bool)
	SaveUser(u *User) error
}

// InMemDB is an in-memory database.
type InMemDB struct {
	InMemMsgQ
	InMemUserDB
}

// InMemMsgQ is a DB impelementation for development and testing.
type InMemMsgQ struct{}

// NewInMemDB creates a new in-memory database.
func NewInMemDB() InMemDB {
	return InMemDB{
		InMemUserDB: InMemUserDB{
			ids:    make(map[string]*User),
			emails: make(map[string]*User),
		},
	}
}

// InMemUserDB is in-memory user database.
type InMemUserDB struct {
	ids    map[string]*User
	emails map[string]*User
}

// GetByID retrieves a user by ID.
func (db InMemUserDB) GetByID(id string) (u *User, ok bool) {
	u, ok = db.ids[id]
	return
}

// GetByMail retrieves a user by e-mail address.
func (db InMemUserDB) GetByMail(email string) (u *User, ok bool) {
	u, ok = db.emails[email]
	return
}

// SaveUser save or updates a user object in the database.
func (db InMemUserDB) SaveUser(u *User) error {
	if u.ID == "" {
		u.ID = strconv.Itoa(len(db.ids) + 1)
	}

	db.ids[u.ID] = u
	db.emails[u.Email] = u
	return nil
}
