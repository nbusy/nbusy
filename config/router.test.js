const wss = require('./wss')
const router = require('./router')

describe('router', () => {
  it('routes', async () => {
    const r = router.get()
    r.add({route: 'wow', handler: () => {}})
  })
})
