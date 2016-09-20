/**
 * Router middleware.
 */

exports.get = () => {
  return {
    routes: [],
    mid (ws, data) {
      const msg = JSON.parse(data)

    },
    add (route) {
      this.routes.push(route)
    }
  }
}
