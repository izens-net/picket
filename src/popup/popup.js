import loadPolicy from '../loadPolicy'

document.addEventListener('DOMContentLoaded', () => {
  const policyFileForm = document.getElementById('policyFileForm')
  policyFileForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const policyFileUrl = new FormData(policyFileForm).get('policyFile')
    loadPolicy(policyFileUrl)
  })
})
