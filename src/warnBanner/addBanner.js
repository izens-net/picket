const sharedStyles =
  ['normalize.css', 'skeleton.css', 'custom.css'].map(css =>
      chrome.runtime.getURL(css));

const ignoreBannerClickHandler = () => {
  chrome.storage.local.get(['warn'], (value) => {
    const hostname = document.location.hostname
    let warn = Object.assign({}, value.warn, { [hostname]: false })
    chrome.storage.local.set({ warn })
    document.getElementById('warning-banner').style.display = 'none'
  })
}

const addBanner = (warning) => {
  document.body.innerHTML += `
    <div id='warning-banner'>
      <link href='${sharedStyles[0]}' rel='stylesheet'>
      <link href='${sharedStyles[1]}' rel='stylesheet'>
      <link href='${sharedStyles[2]}' rel='stylesheet'>
      <div role="alertdialog" aria-describedby="Union message" style="z-index: 9999; background-color: white; bottom: 0; color: black; left: 0; padding: 1rem; position: fixed; right: 0; ">
        <button id='banner-dismiss' style="float: left; margin-right: 1rem;">Okay</button>
        <div id="warn-message" style="margin-top: .75rem; margin-left: 6rem">
          This website does not comply with your union's policy.
          This is because: ${warning}
        </div>
      </div>
    </div>
  `

  document.getElementById('banner-dismiss').addEventListener('click', ignoreBannerClickHandler)
}


document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['warn'], (value) => {
    const hostname = document.location.hostname
    if (value.warn[hostname]) {
      addBanner(value.warn[hostname]);
    }
  })
})
