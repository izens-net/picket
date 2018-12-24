chrome.webRequest.onBeforeRequest.addListener(
  () => { return { cancel: false } },
  { urls: ['*://www.notarealwebsite.com/*'] },
  ['blocking']
)


