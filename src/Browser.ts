import puppeteer, { LaunchOptions } from 'puppeteer'
import useProxy from 'puppeteer-page-proxy'
import Page from './Page'
import { logger } from '.'

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
    const { url, timeout, proxy } = crawlerPage
    const page = await this._browser.newPage()
    try {
      page.setDefaultNavigationTimeout(timeout!)
      if (proxy) {
        // TODO: 解决无法代理的问题
        await useProxy(page, proxy)
        logger.info('[请求代理]', crawlerPage.url, '->', proxy)
      }
      await page.goto(url)
      const content = await page.content()
      return content
    } catch (err) {
      console.error(err)
      throw err
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
