chrome.webRequest.onBeforeRequest.addListener(
  () => { return { cancel: true } },
  { urls: ['*://www.notarealwebsite.com/*'] },
  ['blocking']
)


