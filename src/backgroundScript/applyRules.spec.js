import { expect } from 'chai'
import applyRules from './applyRules.js'

global.chrome = { runtime: { getURL: (str) => str } }
const today = new Date(Date.now()).toDateString()
const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toDateString()
const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toDateString()
const dayBefore = new Date(new Date().getTime() - 48 * 60 * 60 * 1000).toDateString()

describe('applyRules', () => {
  it('cancels blocked url with no dates', () => {
    const policy = {
      "name": "pineapple",
      "url": "www.pineapple.com",
      "rules": [{
        "sites": ["*://www.notarealwebsite.com/*"],
        "actions": [{ "action": "block", "message": "not okay" }]
      }]
    }
    const blockingResponse = applyRules(policy)({ url: 'http://www.notarealwebsite.com' })
    const expected = "blocked.html?union=pineapple&msg=not%20okay&union_url=www.pineapple.com"
    expect(blockingResponse).to.deep.equal({ redirectUrl: expected })
  })

  it('cancels blocked url with start date but no end date', () => {
    const policy = {
      "name": "pineapple",
      "url": "www.pineapple.com",
      "rules": [{
        "sites": ["*://www.today.com/*"],
        "actions": [{
          "action": "block",
          "message": "not okay",
          "startDate": today
        }]
      }]
    }

    const blockingResponse = applyRules(policy)({ url: 'http://www.today.com' })
    const expected = "blocked.html?union=pineapple&msg=not%20okay&union_url=www.pineapple.com"
    expect(blockingResponse).to.deep.equal({ redirectUrl: expected })
  })

  it('cancels blocked url with start and end date', () => {
    const policy = {
      "name": "pineapple",
      "url": "www.pineapple.com",
      "rules": [{
        "sites": ["*://www.today.com/*"],
        "actions": [{
          "action": "block",
          "message": "not okay",
          "startDate": today,
          "endDate": tomorrow
        }]
      }]
    }
    const blockingResponse = applyRules(policy)({ url: 'http://www.today.com' })
    const expected = "blocked.html?union=pineapple&msg=not%20okay&union_url=www.pineapple.com"
    expect(blockingResponse).to.deep.equal({ redirectUrl: expected })
  })

  it('does nothing if blocking start date is in the future', () => {
    const policy = {
      "name": "pineapple",
      "rules": [{
        "sites": ["*://www.tomorrow.com/*"],
        "actions": [{
          "action": "block",
          "message": "not okay",
          "startDate": tomorrow
        }]
      }]
    }
    const blockingResponse = applyRules(policy)({ url: 'http://www.tomorrow.com' })
    const expected = "blocked.html?union=pineapple&msg=not%20okay"
    expect(blockingResponse).to.deep.equal({})
  })

  it('does nothing if blocking end date is passed', () => {
    const policy = {
      "name": "pineapple",
      "rules": [{
        "sites": ["*://www.yesterday.com/*"],
        "actions": [{
          "action": "block",
          "message": "not okay",
          "startDate": dayBefore,
          "endDate": yesterday
        }]
      }]
    }
    const blockingResponse = applyRules(policy)({ url: 'http://www.tomorrow.com' })
    const expected = "blocked.html?union=pineapple&msg=not%20okay"
    expect(blockingResponse).to.deep.equal({})
  })

  it('does nothing if url not listed', () => {
    const policy = {
      "name": "pineapple",
      "rules": [{
        "sites": ["*://www.notarealwebsite.com/*"],
        "actions": [{ "action": "block", "message": "not okay" }]
      }]
    }
    const blockingResponse = applyRules(policy)({ url: 'http://abc' })

    expect(blockingResponse).to.deep.equal({})
  })
})
