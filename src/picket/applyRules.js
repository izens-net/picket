const blockRequest = () => {
  const extension = chrome.runtime.getURL("src/picket/templates/blocked.html")
  return { redirectUrl: extension }
}

const matchesRulePattern = (url) => ({ sites }) => {
  return sites.some(pattern => new RegExp(pattern.replace('*', '.*')).test(url))
}

export default (rules) => ({ url }) => {
  return rules
    .filter(matchesRulePattern(url))
    .reduce((acc, rule) => {
      if (rule.actions.find(a => a.action === 'block')) return blockRequest()
      return {}
    }, {})
}
