import applyRules from './applyRules.js'
import loadPolicy from '../loadPolicy.js'

let policyUrl
let testPolicy = {
  "name" : "pineapple",
  "rules": [
    {
      "sites": ["*://www.notarealwebsite.com/*"],
      "actions": [
        { "action": "block", "message": "not okay" }
      ]
    },
    {
      "sites": ["*://www.notawebsite.com/*"],
      "actions": [
        { "action": "warn", "message": "so so" }
      ]
    }
  ]
}
let policy = process.env.NODE_ENV === 'test'
  ? testPolicy
  : { name: "none", rules: [] }

// retrieve policy from storage
chrome.storage.sync.get(['policy', 'policyFileUrl'], (value) => {
  if (value.policy) policy = value.policy
  if (value.policyFileUrl) policyUrl = value.policyFileUrl
})

chrome.storage.onChanged.addListener((changes) => {
  if (changes.policy) policy = changes.policy.newValue
  if (changes.policyFileUrl) policyUrl = changes.policyFileUrl.newValue
})

// create job for reload policy at midnight
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('policyReload', {
    when: new Date().setHours(24, 0, 0, 0), // starts at midnight
    periodInMinutes: 1440 // runs every day
  })

  chrome.alarms.onAlarm.addListener(({ name }) => {
    if (name === 'policyReload' && policyUrl) loadPolicy(policyUrl)
  })
})

// handles request
chrome.webRequest.onBeforeRequest.addListener(
  (details) => applyRules(policy)(details),
  { urls: ['<all_urls>'] },
  ['blocking']
)
