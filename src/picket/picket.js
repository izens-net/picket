import applyRules from './applyRules.js'

let policy = {}
chrome.storage.sync.get(['policy'], (value) => {
  if (value.policy) policy = value.policy
})
chrome.storage.onChanged.addListener((value) => {
  if (value.policy) policy = value.policy
})

chrome.webRequest.onBeforeRequest.addListener(
  (details) => applyRules(policy)(details),
  { urls: ['<all_urls>'] },
  ['blocking']
)
