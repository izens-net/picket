const storePolicyForUser = (policyFile) => {
  chrome.storage.sync.set({ policy: policyFile }, () => {
    console.log('Rules saved!')
  })
}

const fetchPolicyFile = (policyFileUrl) => {
  return fetch(policyFileUrl)
    .then(resp => resp.json())
}

const loadPolicy = (form) => (ev) => {
  ev.preventDefault();
  const policyFileUrl = new FormData(form).get('policyFile')
  fetchPolicyFile(policyFileUrl).then(p => storePolicyForUser(p));
}

document.addEventListener('DOMContentLoaded', () => {
  const policyFileForm = document.getElementById('policyFileForm')
  policyFileForm.addEventListener('submit', loadPolicy(policyFileForm))
})

