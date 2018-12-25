import applyRules from './applyRules.js'

const fetchRulesFromStorage = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['rules'], ({ rules }) => resolve(rules))
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


