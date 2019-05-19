import copy from 'rollup-copy-plugin'
import replace from 'rollup-plugin-replace'
import json from 'rollup-plugin-json'

const createConfig = (filename, bundleName) => {
  return {
    input: filename,
    output: {
      file: `dist/${bundleName}.js`,
      format: 'iife'
    },
    plugins: [
      json({ preferConst: true }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
    ]
  }
}

export default [
  createConfig('src/backgroundScript/picket.js', 'picket'),
  createConfig('src/popup/popup.js', 'popup'),
  createConfig('src/blockedPage/blocked.js', 'blocked'),
  createConfig('src/contentScripts/campaignLinks.js', 'campaignLinks'),
  Object.assign(createConfig('src/warnBanner/addBanner.js', 'banner'),
  {
    plugins: [
      copy({
        'manifest.json': 'dist/manifest.json',
        'src/popup/popup.html': 'dist/popup.html',
        'src/popup/popup.css': 'dist/popup.css',
        'src/blockedPage/blocked.html': 'dist/blocked.html',
        'src/blockedPage/blocked.css': 'dist/blocked.css',
        'website/css/custom.css': 'dist/custom.css',
        'website/css/normalize.css': 'dist/normalize.css',
        'website/css/skeleton.css': 'dist/skeleton.css'
      })
    ]
  })
]
