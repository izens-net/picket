const addBanner = (warning) => {
  const banner =
    `<div role="alertdialog" aria-describedby="Union message" style="z-index: 9999; background-color: #061722; bottom: 0; color: #fff; left: 0; padding: 1rem; position: fixed; right: 0; ">
      <button style="float: left; margin-right: 1rem;     transition: all .2s ease-out; box-shadow: 0 1.5px 4px rgba(0,0,0,.16), 0 1.5px 6px rgba(0,0,0,.12); max-width: 100%; background-color: #965E1C; border: 1px solid transparent; border-radius: .125rem; color: #fff; cursor: pointer; display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: 1px; line-height: 2.375rem; margin-right: 0; max-width: 40rem; overflow: hidden; padding: 0 1rem; text-align: center; text-overflow: ellipsis; text-transform: uppercase; white-space: nowrap; word-wrap: normal;">Okay</button>
      <div id="warn-message" style="margin-top: .75rem; margin-left: 6rem">${warning}</div>
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
