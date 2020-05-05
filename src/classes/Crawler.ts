import logger from '../utils/logger'
import fastq from 'fastq'
import request from 'superagent'
import Page from './Page'

// 默认数据合并
function assignData(
  data: WebCrawler.CallbackData,
  type: string,
  resp: request.Response
) {
  switch (type) {
    case 'html':
      data.raw = resp.text
      data.$ = cheerio.load(data.raw)
    case 'json':
      data.raw = resp.text
      try {
        data.json = JSON.parse(data.raw)
      } catch (err) {
        logger.error('[JSON解析错误]', data.page.url, '\n', err)
      }
      break
    case 'image':
      break
  }
}

// 默认网络请求处理
const defaultWorker: WebCrawler.RequestWorker = async function(
  page: Page,
  done: WebCrawler.Callback
) {
  const { type, url, timeout } = page
  const data: WebCrawler.CallbackData = { raw: '', page }
  let error = null

  try {
    logger.info('[发起请求]', url)
    const resp = await request.get(url).timeout(timeout!)
    assignData(data, type, resp)
  } catch (err) {
    error = err
    logger.error('[请求错误]', url, '\n', err)
  }

  done(error, data)
}

// 未定义回调的错误提示
function undefinedCallback(
  err: Error | null,
  { page }: WebCrawler.CallbackData
) {
  logger.error('[回调错误]', '没有进行回调处理:\n', page)
}

export default class Crawler {
  _queue!: WebCrawler.Queue
  _concurrency!: number
  _timeout!: number
  _filter: WebCrawler.Filter = _ => true
  _callback?: WebCrawler.Callback

  constructor(options: WebCrawler.CrawlerOptions = {}) {
    let {
      concurrency = 1,
      worker = defaultWorker,
      timeout = 20 * 1000,
      callback
    } = options

    this._concurrency = concurrency
    this._timeout = timeout
    this._callback = callback
    this._initQueue(worker, concurrency)
  }

  _initQueue(worker: WebCrawler.RequestWorker, concurrency: number) {
    this._queue = fastq(this, worker, concurrency)
    this.pause()
  }

  _getPageCallback(page: Page) {
    return page.callback || this._callback || undefinedCallback
  }

  timeout(timeout: number) {
    this._timeout = timeout
    return this
  }

  callback(callback: WebCrawler.Callback) {
    this._callback = callback
    return this
  }

  filter(filter: WebCrawler.Filter) {
    this._filter = filter
    return this
  }

  add(page: Page | Page[]) {
    let pages = Array.isArray(page) ? page : [page]
    pages = pages.filter(this._filter)
    pages.forEach(page => {
      if (!page.timeout) page.timeout = this._timeout
      this._queue.push(page, this._getPageCallback(page))
    })
    return this
  }

  start() {
    this._queue.resume()
  }

  pause() {
    this._queue.pause()
  }

  stop(drain: boolean) {
    return drain ? this._queue.killAndDrain() : this._queue.kill()
  }
}
