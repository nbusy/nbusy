package cmap

import "sync"

// CMap is a thread-safe map.
type CMap struct {
	items map[interface{}]interface{}
	mutex sync.RWMutex
}

// New creates and returns a new thread-safe map.
func New() *CMap {
	return &CMap{items: make(map[interface{}]interface{})}
}

// Get retrieves a value for a given key.
func (c *CMap) Get(key interface{}) (val interface{}) {
	c.mutex.RLock()
	val = c.items[key]
	c.mutex.RUnlock()
	return
}

// GetOk retrieves a value for a given key.
// An 'ok' flag is also returned indicating whether a value exists for the given key.
func (c *CMap) GetOk(key interface{}) (val interface{}, ok bool) {
	c.mutex.RLock()
	val, ok = c.items[key]
	c.mutex.RUnlock()
	return
}

// Range iterates over the entire collection and executes given function on each item.
func (c *CMap) Range(fn func(val interface{})) {
	c.mutex.RLock()
	for _, item := range c.items {
		fn(item)
	}
	c.mutex.RUnlock()
}

// Len returns the item count.
func (c *CMap) Len() int {
	c.mutex.RLock()
	defer c.mutex.RUnlock()
	return len(c.items)
}

// Set stores a value for a given key.
func (c *CMap) Set(key interface{}, val interface{}) {
	c.mutex.Lock()
	c.items[key] = val
	c.mutex.Unlock()
}

// Delete removes a value for a given key.
func (c *CMap) Delete(key interface{}) {
	c.mutex.Lock()
	delete(c.items, key)
	c.mutex.Unlock()
}
