const { Builder, By, Key, until } = require('selenium-webdriver')
const { expect } = require('chai')
const chrome = require('selenium-webdriver/chrome')

describe('picket', () => {
  const driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments('--load-extension=./dist'))
    .build()

  after(async () => driver.quit())

  it('warns', async () => {
    await driver.get('http://www.notawebsite.com')
    const text = await driver.findElement(By.id('warning-banner')).getText()

    expect(text).to.contain('This website does not comply')
  })

  it('blocks', async () => {
    await driver.get('http://www.notarealwebsite.com')
    const text = await driver.findElement(By.css('.blocked-title')).getText()

    expect(text).to.contain('This site was blocked')
  })
})
