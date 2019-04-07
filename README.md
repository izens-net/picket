[![CircleCI](https://circleci.com/gh/izens-net/picket.svg?style=svg)](https://circleci.com/gh/izens-net/picket)

# Picket - Netizens' Association's Browser Extension

This project is a browser extension that allows unions to organize boycotts
and define their demands, while guaranteeing union members can participate
seamlessly. This is how it works:

1. Unions define their policies with a set of rules determining which websites
   break their goals. The unions can also organize timed boycotts (e.g.
   blocking a website for a given day).
1. Any netizen can browse through existing unions and decide which one best
   represent her.
1. The netizen then install this browser extension and feeds it the union policy
   file.
1. Every time she visits a website that is blocked, the extension will inform
   the website that a user from the given union has decided to boycott the
   website and she will not be using it today (she will see the union's message
   as to why). In case the website is not blocked, but still violates union
   rules, the netizen will see a warning banner as she browses.

To read more about Netizens' Association and for a list of existing unions,
visit [our website](https://netizensassociation.github.io/website/).

## Contributing

- Installing: `npm install`
- Building: `npm run build`
- Building in watch mode: `npm run watch`
- Running tests: `npm run test`
- Running tests in watch mode: `npm run test-watch`
- Running browser tests: `npm run integration-test`
- Uploading the Chrome extension in developer mode, read through [Chrome's
  Getting Started
  guide](https://developer.chrome.com/extensions/getstarted#manifest)
- Running extension in Firefox (in watch mode): `npm run firefox`

## Project Structure

This extension is composed of a few different components, all which run at
different times of the extension lifecycle. To understand them a bit better, it
might be useful to read through [Chrome Extensions' Architecture
Overview](https://developer.chrome.com/extensions/overview#arch).

```
src
├── backgroundScript (runs in the background every time the user opens a page to
determine whether page should be blocked or acted upon)
│   ├── applyRules.js
│   ├── applyRules.spec.js
│   └── picket.js (entry file)
├── blockedPage (standalone page for when a page is blocked)
│   ├── blocked.css
│   ├── blocked.html
│   └── blocked.js
├── popup (popup for when user clicks on the extension)
│   ├── loadPolicy.js
│   ├── popup.css
│   └── popup.html
├── shared.css
└── warnBanner (content script that runs on every page loaded to determine whether to show the banner or not)
    └── addBanner.js
```
