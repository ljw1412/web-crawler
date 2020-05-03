import Page from './Page'

export default class Crawler {
  private queue: Page[] = []
  private callback?: WebCrawler.Callback

  constructor(callback?: WebCrawler.Callback) {
    console.log('new Crawler')
    this.callback = callback
  }

  add(page: Page | Page[]) {
    if (Array.isArray(page)) {
      this.queue.push(...page)
    } else {
      this.queue.push(page)
    }
  }
}
