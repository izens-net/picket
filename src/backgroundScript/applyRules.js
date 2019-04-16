// we need to filter out requests that come from our own
// extension, otherwise the /boycott request becomes recursive
// and never finishes
const requestIsFromPicket = (originUrl, initiator) => {
  const isFromFirefoxPicket = originUrl && originUrl.startsWith('moz-extension')
  const isFromChromePicket = initiator && initiator.startsWith('chrome-extension')
  return isFromFirefoxPicket || isFromChromePicket
}

const shouldBlock = (blocked, originUrl, initiator) => {
  if (!blocked || requestIsFromPicket(originUrl, initiator)) return false

  const { startDate, endDate } = blocked
  if (startDate && new Date(startDate) > Date.now()) return false
  if (endDate && new Date(endDate) < Date.now()) return false
  return true
}

const fetchBlockPage = (union, unionUrl, message) => {
  const unionEncoded = encodeURIComponent(union);
  const unionUrlEncoded = encodeURIComponent(unionUrl);
  const msgEncoded = encodeURIComponent(message);
  return chrome
    .runtime
    .getURL(`blocked.html?union=${unionEncoded}&msg=${msgEncoded}&union_url=${unionUrlEncoded}`)
}

const sendBoycottRequest = (url, message) => {
  const parsedUrl = new URL(url)
  fetch(`${parsedUrl.protocol}//${parsedUrl.hostname}/boycott`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ message })
  })
}

const blockRequest = (url, union, unionUrl, message) => {
  sendBoycottRequest(url, message)
  return { redirectUrl: fetchBlockPage(union, unionUrl, message) }
}

const prepareBanner = (url, msg) => {
  const hostname = new URL(url).hostname
  chrome.storage.local.get(['warn'], (value) => {
    const warn = Object.assign({ [hostname]: msg }, value.warn)
    chrome.storage.local.set({ warn });
  })
}

const matchesRulePattern = (url) => ({ sites }) => {
  return sites.some(pattern => new RegExp(pattern.replace('*', '.*')).test(url))
}

export default (policy) => ({ url, originUrl, initiator }) => {
  const rule = policy.rules
    .find(matchesRulePattern(url))

  if (!rule) return {}

  const blockAction = rule.actions.find(a => a.action === 'block')
  if (shouldBlock(blockAction, originUrl, initiator)) {
    return blockRequest(url, policy.name, policy.url, blockAction.message)
  }

  const warn = rule.actions.find(a => a.action === 'warn')
  if (warn) { return prepareBanner(url, warn.message) }

  return {}
}
