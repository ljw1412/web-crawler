import fastq from 'fastq'
import cheerio from 'cheerio'
import request from 'superagent'
import Page from './Page'
import logger from '../utils/logger'
import { EventEmitter } from 'events'

function noop() {}

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
      break
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
  _emitter: EventEmitter = new EventEmitter()
  _eventTypeCount: number = 0

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
    return (
      page.callback ||
      this._callback ||
      (this._eventTypeCount ? noop : undefinedCallback)
    )
  }

  _getPageCallbackWrapper(page: Page): WebCrawler.Callback {
    return (err, data) => {
      if (err) {
        this._emitter.emit('error', err)
      } else {
        this._emitter.emit('data', data)
        this._emitter.emit(`data.${page.type}`, data)
        if (page.tag) {
          this._emitter.emit(`data#${page.tag}`, data)
        }
      }
      this._getPageCallback(page)(err, data)
    }
  }

  on(event: string | symbol, listener: (...args: any[]) => void) {
    this._emitter.on(event, listener)
    this._eventTypeCount = this._emitter.eventNames().length
    return this
  }

  off(event: string | symbol, listener: (...args: any[]) => void) {
    this._emitter.off(event, listener)
    this._eventTypeCount = this._emitter.eventNames().length
    return this
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
      this._queue.push(page, this._getPageCallbackWrapper(page))
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
