import loadPolicy from './loadPolicy.js'
import { stub } from 'sinon'
import { expect } from 'chai'

describe('loadPolicy', () => {
  beforeEach(() => {
    global.fetch = stub().resolves({ json: () => ({ policy: 'somepolicy' }) })
    global.chrome = { storage: { sync: { set: stub() } } }
  })

  afterEach(() => {
    delete global.fetch
    delete global.chrome
  })

  it('fetches policy from url', () => {
    return loadPolicy('policyFileURL').then(() => {
      expect(global.fetch).to.have.been.calledWith('policyFileURL')
    })
  })

  it('sets policy in storage', () => {
    return loadPolicy('policyFileURL').then(() => {
      const args = global.chrome.storage.sync.set.firstCall.args[0]
      expect(args.policy).to.deep.equal({ policy: 'somepolicy' })
      expect(args.policyFileUrl).to.deep.equal('policyFileURL')
      expect(args.date).to.be.a('number')
    })
  })
})
