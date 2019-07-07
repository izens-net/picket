const { Capabilities, Builder, By, Key, until } = require('selenium-webdriver')
const { expect } = require('chai')
const chrome = require('selenium-webdriver/chrome')
const firefox = require('selenium-webdriver/firefox')

const runTest = (name) => {
  describe(`${name}`, () => {
    const chromeCapabilities = Capabilities.chrome();
    chromeCapabilities.set(
      'goog:chromeOptions', {
        args: [
          '--load-extension=./dist',
        ],
      }
    )
    const driver = new Builder()
      .forBrowser(name)
      .withCapabilities(chromeCapabilities)
      .build()

    before(async () => {
      await driver
        .get('https://izens.net')
      await driver.sleep(100)

      await driver
        .findElement(By.css('#campaigns > ul > li:first-child > a'))
        .click()
      await driver.sleep(1000)
    })

    after(async () => driver.quit())

    it('warns', async () => {
      await driver.get('http://www.notawebsite.com')
      await driver.sleep(1000)
      const text = await driver.findElement(By.id('warning-banner')).getText()

      expect(text).to.contain('so so')
    })

    it('blocks', async () => {
      await driver.get('http://www.notarealwebsite.com')
      await driver.sleep(1000)
      const text = await driver.findElement(By.css('.content')).getText()

      expect(text).to.contain('This site was blocked by pineapple')
      expect(text).to.contain('not okay')
    })
  })
}

describe('picket', () => {
  const browsers = ['chrome']
  browsers.forEach(runTest)
})

