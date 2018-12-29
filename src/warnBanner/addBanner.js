const sharedStyles = chrome.runtime.getURL('src/shared.css')

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
      <link href='${sharedStyles}' rel='stylesheet'>
      <div role="alertdialog" aria-describedby="Union message" style="z-index: 9999; background-color: var(--main-color); bottom: 0; color: #fff; left: 0; padding: 1rem; position: fixed; right: 0; ">
        <button id='banner-dismiss' style="float: left; margin-right: 1rem;     transition: all .2s ease-out; box-shadow: 0 1.5px 4px rgba(0,0,0,.16), 0 1.5px 6px rgba(0,0,0,.12); max-width: 100%; background-color: var(--second-complimentary-color); border: 1px solid transparent; border-radius: .125rem; color: #fff; cursor: pointer; display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: 1px; line-height: 2.375rem; margin-right: 0; max-width: 40rem; overflow: hidden; padding: 0 1rem; text-align: center; text-overflow: ellipsis; text-transform: uppercase; white-space: nowrap; word-wrap: normal;">Okay</button>
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
