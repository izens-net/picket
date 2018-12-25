const storeRulesForUser = (policyFile) => {
  chrome.storage.sync.set(policyFile, () => {
    console.log('Rules saved!')
  })
}

const fetchPolicyFile = async (policyFileUrl) => {
  return fetch(policyFileUrl)
    .then(resp => resp.json())
}

const loadRules = (form) => async (ev) => {
  const policyFileUrl = new FormData(form).get('policyFile')
  const policyFile = await fetchPolicyFile(policyFileUrl)
  storeRulesForUser(policyFile)
}

document.addEventListener('DOMContentLoaded', () => {
  const policyFileForm = document.getElementById('policyFileForm')
  policyFileForm.addEventListener('submit', loadRules(policyFileForm))
})

