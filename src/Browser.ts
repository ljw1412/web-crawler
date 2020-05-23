import puppeteer, { LaunchOptions } from 'puppeteer'

export default class Browser {
  _browser!: puppeteer.Browser

  constructor() {}

  async init(config: LaunchOptions = {}) {
    this._browser = await puppeteer.launch(config)
  }

  async getSourceCode(url: string) {
    const page = await this._browser.newPage()
    await page.goto(url)
    const content = await page.content()
    await page.close()
    return content
  }

  async destroy() {
    return await this._browser.close()
  }
}
