const blockRequest = (union, msg) => {
  const unionEncoded = encodeURIComponent(union);
  const msgEncoded = encodeURIComponent(msg);
  const extension = chrome
    .runtime
    .getURL(`src/pages/blocked.html?union=${unionEncoded}&msg=${msgEncoded}`)
  return { redirectUrl: extension }
}

const matchesRulePattern = (url) => ({ sites }) => {
  return sites.some(pattern => new RegExp(pattern.replace('*', '.*')).test(url))
}

export default (policy) => ({ url }) => {
  return policy.rules
    .filter(matchesRulePattern(url))
    .reduce((acc, rule) => {
      const action = rule.actions.find(a => a.action === 'block')
      if (action)
        { return blockRequest(policy.name, action.message) }
      return {}
    }, {})
}
