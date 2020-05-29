import puppeteer, { LaunchOptions } from 'puppeteer'
import { logger, Page } from '.'
import useProxy from './utils/proxy'

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

  async getSourceCode(crawlerPage: Page) {
    if (!this._launching) {
      await this.init()
    }
    const { id, url, timeout, proxy } = crawlerPage
    const page = await this._browser.newPage()
    try {
      page.setDefaultNavigationTimeout(timeout!)
      if (proxy) {
        logger.warn('[请求代理]', url, '->', proxy)
        await useProxy(page, proxy)
      }
      logger.info(`[${id}|打开页面]puppeteer`, url)
      await page.goto(url)
      const content = await page.content()
      return content
    } finally {
      await page.close()
    }
  }

  async getPageCount() {
    return (await this._browser.pages()).length
  }

  async destroy() {
    await this._browser.close()
    this._launching = false
    return
  }
}
