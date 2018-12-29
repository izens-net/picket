const blockRequest = (union, msg) => {
  const unionEncoded = encodeURIComponent(union);
  const msgEncoded = encodeURIComponent(msg);
  const extension = chrome
    .runtime
    .getURL(`blocked.html?union=${unionEncoded}&msg=${msgEncoded}`)
  return { redirectUrl: extension }
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

export default (policy) => ({ url }) => {
  return policy.rules
    .filter(matchesRulePattern(url))
    .reduce((acc, rule) => {
      const blocked = rule.actions.find(a => a.action === 'block')
      if (blocked) { return blockRequest(policy.name, blocked.message) }

      const warn = rule.actions.find(a => a.action === 'warn')
      if (warn) { return prepareBanner(url, warn.message) }
      return {}
    }, {})
}
