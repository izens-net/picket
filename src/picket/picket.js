import applyRules from './applyRules.js'

let policy = {
  name: "none",
  rules: []
}

chrome.storage.sync.get(['policy'], (value) => {
  if (value.policy) policy = value.policy
})
chrome.storage.onChanged.addListener((changes) => {
  if (changes.policy) policy = changes.policy.newValue
})

chrome.webRequest.onBeforeRequest.addListener(
  (details) => applyRules(policy)(details),
  { urls: ['<all_urls>'] },
  ['blocking']
)
