import loadPolicy from '../loadPolicy'

document.addEventListener('DOMContentLoaded', () => {
  const policyFileForm = document.getElementById('policyFileForm')
  policyFileForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const policyFileUrl = new FormData(policyFileForm).get('policyFile')
    loadPolicy(policyFileUrl)
      .then(e => {
        var animateIn = document.getElementById("notification");
        animateIn.className = "show";
        setTimeout(function(){
          animateIn.className = animateIn.className.replace("show", "");
        }, 3000);
        e.preventDefault();
      })
  })
})
