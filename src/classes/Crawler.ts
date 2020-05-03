import fastq from 'fastq'
import chalk from 'chalk'
import request from 'superagent'
import Page from './Page'

interface CrawlerOptions {
  concurrency: number
  worker?: fastq.worker<Crawler>
  callback?: WebCrawler.Callback
}

const defaultWorker: fastq.worker<Crawler> = async function(
  page: Page,
  done: WebCrawler.Callback
) {
  try {
    const res = await request.get(page.url)
    done(null, { html: res.text, page })
  } catch (error) {
    done(error, { page })
  }
}

export default class Crawler {
  private queue!: fastq.queue
  private callbackFn?: WebCrawler.Callback
  private filterFn: WebCrawler.Filter = page => true

  constructor(options: CrawlerOptions = { concurrency: 1 }) {
    const { concurrency = 1, worker = defaultWorker, callback } = options
    this.queue = fastq(this, worker, concurrency)
    this.callbackFn = callback
    this.queue.pause()
  }

  get size() {
    return this.queue.length
  }

  get isEmpty() {
    return !!this.size
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
