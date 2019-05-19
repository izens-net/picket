window.addEventListener('message', (event) => {
  if (event.source == window
    && event.data
    && event.data.type === 'add-campaign-policy') {
    chrome.runtime.sendMessage(event.data)
  }
})

