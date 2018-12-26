const addBanner = (warning) => {
  const banner =
    `<div role="alertdialog" aria-describedby="Union message">
      <div id="warn-message">${warning}</div>
      <button>OK</button>
     </div>`

  document.body.innerHTML += banner;
}

chrome.storage.local.get(['warn'], (value) => {
  console.log(value.warn);
  if (value.warn && value.warn !== {}) {
    addBanner(value.warn);
    chrome.storage.local.set({ warn: false });
  }
})
