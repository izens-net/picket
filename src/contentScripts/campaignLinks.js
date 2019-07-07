window.addEventListener('message', (event) => {
  console.log('receiving message', event.data)
  if (event.source == window
    && event.data
    && event.data.type === 'add-campaign-policy') {
    chrome.runtime.sendMessage(event.data)
  }

  var animateIn = document.getElementById("notification")
  animateIn.className = "show"
  setTimeout(function(){
    animateIn.className = animateIn.className.replace("show", "")
  }, 3000)
})

