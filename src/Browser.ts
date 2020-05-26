import puppeteer, { LaunchOptions } from 'puppeteer'
import { config } from './default'

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

  async getSourceCode(url: string, timeout: number = config.timeout) {
    if (!this._launching) {
      await this.init()
    }
    const page = await this._browser.newPage()
    try {
      await page.goto(url, { timeout })
      const content = await page.content()
      return content
    } finally {
      await page.close()
    }
  }

  async destroy() {
    await this._browser.close()
    this._launching = false
    return
  }
}
