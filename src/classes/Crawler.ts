import Page from './Page'
import chalk from 'chalk'

export default class Crawler {
  private queue: Page[] = []
  private callbackFn?: WebCrawler.Callback
  private filterFn: WebCrawler.Filter = page => true

  constructor(callback?: WebCrawler.Callback) {
    this.callbackFn = callback
  }

  get size() {
    return this.queue.length
  }

  get isEmpty() {
    return !!this.size
  }

  injectCallbackToPage(page: Page) {
    if (!page.callback && !this.callbackFn) {
      console.error(chalk.red('[Error]', '没有进行回调处理:\n'), page)
      return
    }

    if (!page.callback && this.callbackFn) {
      page.callback = this.callbackFn
    }
  }

  callback(callback: WebCrawler.Callback) {
    this.callbackFn = callback
    return this
  }

  filter(filter: WebCrawler.Filter) {
    this.filterFn = filter
    return this
  }

  add(page: Page | Page[]) {
    let pages = !Array.isArray(page) ? [page] : page
    pages = pages.filter(this.filterFn)
    pages.forEach(this.injectCallbackToPage.bind(this))
    this.queue.push(...pages)
    return this
  }

  start() {}

  stop() {}
}
