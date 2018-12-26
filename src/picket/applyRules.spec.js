import { expect } from 'chai'
import applyRules from './applyRules.js'

global.chrome = {
  runtime: {
    getURL: (str) => str
  }
}

describe('applyRules', () => {
  it('cancels blocked url', () => {
    const blockingResponse = applyRules([{
      "sites": ["*://www.notarealwebsite.com/*"],
      "actions": [ { "action": "block", "message": "not okay" } ]
    }])({ url: 'http://www.notarealwebsite.com' })

    expect(blockingResponse).to.deep.equal({ redirectUrl: "src/picket/templates/blocked.html" })
  })

  it('does nothing if url not listed', () => {
    const blockingResponse = applyRules([{
      "sites": ["*://www.notarealwebsite.com/*"],
      "actions": [ { "action": "block", "message": "not okay" } ]
    }])({ url: 'http://abc' })

    expect(blockingResponse).to.deep.equal({})
  })
})
