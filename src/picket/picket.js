import applyRules from './applyRules.js'

let rules = []
chrome.storage.sync.get(['rules'], (value) => {
  if (value.rules) rules = value.rules
})
chrome.storage.onChanged.addListener((value) => {
  if (value.rules) rules = value.rules
})

chrome.webRequest.onBeforeRequest.addListener(
  (details) => applyRules(rules)(details),
  { urls: ['<all_urls>'] },
  ['blocking']
)


