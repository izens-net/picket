import loadPolicy from './loadPolicy.js'
import { stub } from 'sinon'
import { expect } from 'chai'

describe('loadPolicy', () => {
  beforeEach(() => {
    global.fetch = stub().resolves({ json: () => ({ policy: 'somepolicy' }) })
    global.chrome = { storage: { sync: { set: stub() } } }
    global.FormData = class FormData { get() { return 'policyFileURL' } }
  })

  afterEach(() => {
    delete global.fetch
    delete global.chrome
    delete global.FormData
  })

  it('fetches policy from url', () => {
    return loadPolicy().then(() => {
      expect(global.fetch).to.have.been.calledWith('policyFileURL')
    })
  })

  it('sets policy in storage', () => {
    return loadPolicy().then(() => {
      const args = global.chrome.storage.sync.set.firstCall.args[0]
      expect(args.policy).to.deep.equal({ policy: 'somepolicy' })
      expect(args.policyFileUrl).to.deep.equal('policyFileURL')
    })
  })
})
