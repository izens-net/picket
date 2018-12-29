import loadPolicy from './loadPolicy'

document.addEventListener('DOMContentLoaded', () => {
  const policyFileForm = document.getElementById('policyFileForm')
  policyFileForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    loadPolicy(policyFileForm)
  })
})
