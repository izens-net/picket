const storePolicyForUser = (policy, policyFileUrl) => {
  chrome.storage.sync.set({ policy, policyFileUrl, date: Date.now() }, () => {
    console.log('Rules saved!')
  })
}

const fetchPolicyFile = (policyFileUrl) => {
  return fetch(policyFileUrl)
    .then(resp => resp.json())
}

export default (policyFileUrl) => {
  return fetchPolicyFile(policyFileUrl)
    .then(p => storePolicyForUser(p, policyFileUrl));
}

