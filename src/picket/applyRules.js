const blockRequest = (union, msg) => {
  const unionEncoded = encodeURIComponent(union);
  const msgEncoded = encodeURIComponent(msg);
  const extension = chrome
    .runtime
    .getURL(`src/pages/blocked.html?union=${unionEncoded}&msg=${msgEncoded}`)
  return { redirectUrl: extension }
}

const prepareBanner = (msg) => {
  chrome.storage.local.set({ warn: msg });
}

const matchesRulePattern = (url) => ({ sites }) => {
  return sites.some(pattern => new RegExp(pattern.replace('*', '.*')).test(url))
}

export default (policy) => ({ url }) => {
  return policy.rules
    .filter(matchesRulePattern(url))
    .reduce((acc, rule) => {
      const blocked = rule.actions.find(a => a.action === 'block')
      if (blocked) { return blockRequest(policy.name, blocked.message) }
      const warn = rule.actions.find(a => a.action === 'warn')
      if (warn) { return blockRequest(policy.name, warn.message) }
      return {}
    }, {})
}
