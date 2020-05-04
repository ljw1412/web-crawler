import fastq from 'fastq'
import chalk from 'chalk'
import cheerio from 'cheerio'
import request from 'superagent'
import Page from './Page'

interface CrawlerOptions {
  concurrency: number
  worker?: fastq.worker<Crawler>
  callback?: WebCrawler.Callback
  timeout?: number
}

const defaultWorker: fastq.worker<Crawler> = async function(
  page: Page,
  done: WebCrawler.Callback
) {
  console.log(chalk.bgYellow.magenta.bold('[发起请求]'), page.url)
  try {
    const data: WebCrawler.Done = { page }
    const res = await request.get(page.url).timeout(page.timeout!)
    if (page.type === 'html') {
      data.html = res.text
      data.$ = cheerio.load(res.text)
    }
    done(null, data)
  } catch (error) {
    done(error, { page })
  }
}

export default class Crawler {
  private queue!: fastq.queue
  private callbackFn?: WebCrawler.Callback
  private filterFn: WebCrawler.Filter = page => true
  private timeout!: number

  constructor(options: CrawlerOptions = { concurrency: 1 }) {
    const {
      concurrency = 1,
      worker = defaultWorker,
      callback,
      timeout = 20000
    } = options

    this.queue = fastq(this, worker, concurrency)
    this.callbackFn = callback
    this.queue.pause()
    this.setTimeout(timeout)
  }

  get size() {
    return this.queue.length
  }

  get isEmpty() {
    return !!this.size
  }

  setTimeout(timeout: number) {
    this.timeout = timeout
  }

  callback(callback: WebCrawler.Callback) {
    this.callbackFn = callback
    return this
  }

  filter(filter: WebCrawler.Filter) {
    this.filterFn = filter
    return this
  }

  getPageCallback(page: Page) {
    if (page.callback) return page.callback
    if (this.callbackFn) return this.callbackFn
    return () => {
      console.error(chalk.red('[Error]', '没有进行回调处理:\n'), page)
    }
  }

  add(page: Page | Page[]) {
    let pages = !Array.isArray(page) ? [page] : page
    pages = pages.filter(this.filterFn)
    pages.forEach(page => {
      if (!page.timeout) page.timeout = this.timeout
      this.queue.push(page, this.getPageCallback(page))
    })
    return this
  }

  start() {
    this.queue.resume()
  }

  pause() {
    this.queue.pause()
  }

  stop(drain: boolean) {
    return drain ? this.queue.killAndDrain() : this.queue.kill()
  }
}
