const storePolicyForUser = (policyFile) => {
  chrome.storage.sync.set({ policy: policyFile }, () => {
    console.log('Rules saved!')
  })
}

const fetchPolicyFile = async (policyFileUrl) => {
  return fetch(policyFileUrl)
    .then(resp => resp.json())
}

const loadPolicy = (form) => async (ev) => {
  const policyFileUrl = new FormData(form).get('policyFile')
  const policyFile = await fetchPolicyFile(policyFileUrl)
  storePolicyForUser(policyFile)
}

document.addEventListener('DOMContentLoaded', () => {
  const policyFileForm = document.getElementById('policyFileForm')
  policyFileForm.addEventListener('submit', loadPolicy(policyFileForm))
})

