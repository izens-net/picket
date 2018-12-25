const blockRequest = () => {
  return { cancel: true }
}

const matchesRulePattern = (url) => ({ sites }) => {
  return sites.some(pattern => new RegExp(pattern.replace('*', '.*')).test(url))
}

const applyRules = (rules) => (url) => {
  return rules
    .filter(matchesRulePattern(url))
    .reduce((acc, rule) => {
      if (rule.actions.find(a => a.action === 'block')) return blockRequest()
      return {}
    }, {})
}

module.exports = applyRules
