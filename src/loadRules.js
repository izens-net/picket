const loadRules = (form) => async (ev) => {
  const formData = new FormData(form)
  const policyFileUrl = formData.get('policyFile')
  const policyFile = await fetch(policyFileUrl)
    .then(resp => resp.json())
}

document.addEventListener('DOMContentLoaded', () => {
  const policyFileForm = document.getElementById('policyFileForm')
  policyFileForm.addEventListener('submit', loadRules(policyFileForm))
})

