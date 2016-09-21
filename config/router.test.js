const wss = require('./wss')
const router = require('./router')

describe('router', () => {
  it('routes', async () => {
    const r = router.get()
    const m = {method: 'wow'}

    r.add('wow', (ws, msg) => {
      expect(msg).toEqual(m)
    })
    r.middleware(null, JSON.stringify(m))
  })
})
