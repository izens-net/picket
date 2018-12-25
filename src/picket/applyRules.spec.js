import { expect } from 'chai'
import applyRules from './applyRules.js'

describe('applyRules', () => {
  it('cancels blocked url', () => {
    const blockingResponse = applyRules([{
      "sites": ["*://www.notarealwebsite.com/*"],
      "actions": [ { "action": "block", "message": "not okay" } ]
    }])('http://www.notarealwebsite.com')

    expect(blockingResponse).to.deep.equal({ cancel: true })
  })

  it('does nothing if url not listed', () => {
    const blockingResponse = applyRules([{
      "sites": ["*://www.notarealwebsite.com/*"],
      "actions": [ { "action": "block", "message": "not okay" } ]
    }])('http://abc')

    expect(blockingResponse).to.deep.equal({})
  })
})
