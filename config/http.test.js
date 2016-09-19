// const fetch = require('node-fetch')

function sum (a, b) {
  return Promise.resolve(a + b)
}

describe('sum', () => {
  it('adds 1 + 2 to equal 3', async () => {
    expect(await sum(1, 2)).toBe(3)
  })
})
