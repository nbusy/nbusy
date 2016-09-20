/**
 * Router middleware.
 */

exports.get = () => {
  return {
    routes: {},
    middleware (ws, data) {
      const msg = JSON.parse(data)
      const r = this.routes[msg.method]
      if (r) {
        r(ws, msg)
      }
    },
    add ({method, handler}) {
      this.routes[method] = handler
    }
  }
}
