import { expect } from 'chai'
import applyRules from './applyRules.js'

global.chrome = {
  runtime: {
    getURL: (str) => str
  }
}

const policy = {
  "name": "pineapple",
  "rules": [{
    "sites": ["*://www.notarealwebsite.com/*"],
    "actions": [ { "action": "block", "message": "not okay" } ]
}]}

describe('applyRules', () => {
  it('cancels blocked url', () => {
    const blockingResponse = applyRules(policy)({ url: 'http://www.notarealwebsite.com' })
    const expected = "blocked.html?union=pineapple&msg=not%20okay"
    expect(blockingResponse).to.deep.equal({ redirectUrl: expected })
  })

  it('does nothing if url not listed', () => {
    const blockingResponse = applyRules(policy)({ url: 'http://abc' })

    expect(blockingResponse).to.deep.equal({})
  })
})
