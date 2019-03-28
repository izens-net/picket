const { Builder, By, Key, until } = require('selenium-webdriver')
const { expect } = require('chai')
const chrome = require('selenium-webdriver/chrome')
const firefox = require('selenium-webdriver/firefox')

const runTest = (name) => {
  describe(`${name}`, () => {
    const chromeOptions = new chrome.Options()
      .addArguments('--load-extension=./dist')
    const firefoxOptions = new firefox.Options()
      .addExtensions('./picket.xpi')
    const driver = new Builder()
      .forBrowser(name)
      .setChromeOptions(chromeOptions)
      .setFirefoxOptions(firefoxOptions)
      .build()

    after(async () => driver.quit())

    it('warns', async () => {
      await driver.get('http://www.notawebsite.com')
      await driver.sleep(1000)
      const text = await driver.findElement(By.id('warning-banner')).getText()

      expect(text).to.contain('This website does not comply')
    })

    it('blocks', async () => {
      await driver.get('http://www.notarealwebsite.com')
      await driver.sleep(1000)
      const text = await driver.findElement(By.css('.blocked-title')).getText()

      expect(text).to.contain('This site was blocked')
    })
  })
}

describe('picket', () => {
  const browsers = ['firefox', 'chrome']
  browsers.forEach(runTest)
})

