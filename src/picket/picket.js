const applyRules = require('./applyRules.js')

const fetchRulesFromStorage = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['rules'], resolve)
  })
}

const checkUrl = async ({ url }) => {
  const rules = await fetchRulesFromStorage()
  return applyRules(rules)(url)
}

chrome.webRequest.onBeforeRequest.addListener(
  checkUrl,
  { urls: ['<all_urls>'] },
  ['blocking']
)


