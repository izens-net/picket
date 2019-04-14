import { expect } from 'chai'
import { stub } from 'sinon'
import applyRules from './applyRules.js'

const today = new Date(Date.now()).toDateString()
const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toDateString()
const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toDateString()
const dayBefore = new Date(new Date().getTime() - 48 * 60 * 60 * 1000).toDateString()

describe('applyRules', () => {
  beforeEach(() => {
    global.chrome = {
      runtime: { getURL: (str) => str },
      storage: { local: { get: stub(), set: stub() } }
    }
    global.fetch = stub()
    global.URL = require('url').URL
  })

  context('blocking', () => {
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

    it('sends boycott request when blocked page', () => {
      const policy = {
        "name": "pineapple",
        "rules": [{
          "sites": ["*://www.boycott.com/*"],
          "actions": [{
            "action": "block",
            "message": "not okay",
          }]
        }]
      }
      const blockingResponse = applyRules(policy)({ url: 'http://www.boycott.com' })
      const expectedRequest = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: '{"message":"not okay"}'
      }

      expect(global.fetch).to.have.been
        .calledWith('http://www.boycott.com', expectedRequest)
    })
  })

  context('warn', () => {
    it('adds warning banner', () => {
      global.chrome.storage.local.get.callsFake((value, callback) => callback({}))
      const policy = {
        "name": "pineapple",
        "rules": [{
          "sites": ["*://warn.com/*"],
          "actions": [{ "action": "warn", "message": "not okay" }]
        }]
      }
      applyRules(policy)({ url: 'http://warn.com' })

      expect(global.chrome.storage.local.set).to.have.been
        .calledWith({ warn: { 'warn.com': 'not okay' } })
    })

    it('does not add if banner was already ignored by user', () => {
      global.chrome.storage.local.get
        .callsFake((value, callback) => callback({ warn: { 'warn.com': false } }))
      const policy = {
        "name": "pineapple",
        "rules": [{
          "sites": ["*://warn.com/*"],
          "actions": [{ "action": "warn", "message": "not okay" }]
        }]
      }
      applyRules(policy)({ url: 'http://warn.com' })

      expect(global.chrome.storage.local.set).to.have.been
        .calledWith({ warn: { 'warn.com': false } })
    })
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
