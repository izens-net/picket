import loadPolicy from '../loadPolicy'

const showSuccessMessage = () => {
  var animateIn = document.getElementById("notification")
  animateIn.className = "show"
  setTimeout(function(){
    animateIn.className = animateIn.className.replace("show", "")
  }, 3000)
}

const showJoinedCampaigns = () => {
  chrome.storage.sync.get(['policy'], (value) => {
    if (value.policy) {
      const campaignsEl = document.getElementById('campaigns')
      campaignsEl.innerText = `Your campaign: \n${value.policy.name}`
      campaignsEl.className = "campaigns"
    }
  })
}

const submitForm = (ev) => {
  ev.preventDefault()
  const policyFileUrl = new FormData(policyFileForm).get('policyFile')
  loadPolicy(policyFileUrl)
    .then(showSuccessMessage)
    .then(showJoinedCampaigns)
}

document.addEventListener('DOMContentLoaded', () => {
  const policyFileForm = document.getElementById('policyFileForm')

  policyFileForm.addEventListener('submit', submitForm)
  showJoinedCampaigns()
})
