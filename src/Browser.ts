import puppeteer, { LaunchOptions } from 'puppeteer'

export default class Browser {
  _browser!: puppeteer.Browser
  _launching = false
  config!: LaunchOptions

  constructor(config: LaunchOptions = {}) {
    this.config = config
  }

  async init() {
    this._browser = await puppeteer.launch(this.config)
    this._launching = true
  }

  async getSourceCode(url: string) {
    if (!this._launching) {
      await this.init()
    }
    const page = await this._browser.newPage()
    await page.goto(url)
    const content = await page.content()
    await page.close()
    return content
  }

  async destroy() {
    await this._browser.close()
    this._launching = false
    return
  }
}
