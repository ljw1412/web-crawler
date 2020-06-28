import Page from './Page'
import Browser from './Browser'
import logger from './utils/logger'
import cheerio from 'cheerio'
import { noop, superagentRequest, undefinedCallback } from './default'
import {
  Callback,
  CallbackData,
  Filter,
  Queue,
  CrawlerOptions,
  CrawlerDefaultOptions,
  Listener,
  RequsetHeaders,
  PageOptions
} from './base'
import fastq from 'fastq'
import { EventEmitter } from 'events'

export default class Crawler {
  private _queue!: Queue
  private _concurrency!: number
  private _timeout!: number
  private _headers!: RequsetHeaders
  private _proxy!: string
  private _filter: Filter = _ => true
  private _callback?: Callback
  private _end?: Function
  private _emitter: EventEmitter = new EventEmitter()
  private _eventTypeCount: number = 0
  private _readyExitTimer!: NodeJS.Timer
  private _pageId = 0
  browser!: Browser
  default = this._getDefaultConfig()

  constructor(options: CrawlerOptions = {}) {
    let {
      concurrency = 1,
      timeout = this.default.timeout,
      headers = {},
      browerConfig,
      proxy = '',
      callback,
      end
    } = options

    this._concurrency = concurrency
    this._timeout = timeout
    this._headers = Object.assign(
      { 'User-Agent': this.default['User-Agent'] },
      headers
    )
    this._proxy = proxy
    this._callback = callback
    this._end = end
    this._initQueue(concurrency)
    this.browser = new Browser(browerConfig)
  }

  static use(plugin: Function) {
    plugin.apply(null, [this])
    return this
  }

  _getDefaultConfig(): CrawlerDefaultOptions {
    return {
      timeout: 20000,
      request: superagentRequest,
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
    }
  }

  _callEndFunction() {
    if (this._end) this._end()
    this._emitter.emit('end')
  }

  // 更新准备退出的计时器
  async _updateReadyExitTimer() {
    clearTimeout(this._readyExitTimer)
    if (this.browser._launching) {
      const pageCount = (await this.browser.getPageCount()) - 1
      console.log('[browser] pageCount:', pageCount)
      if (pageCount) {
        this._readyExitTimer = setTimeout(() => {
          this._updateReadyExitTimer()
        }, 3000)
      } else {
        this.browser.destroy()
        clearTimeout(this._readyExitTimer)
        this._callEndFunction()
      }
    } else {
      this._callEndFunction()
    }
  }

  async _worker(page: Page, done: Callback) {
    const { id, url, javascript } = page
    const data: CallbackData = { raw: '', page }
    let error = null
    try {
      if (javascript) {
        const content = await this.browser.getSourceCode(page)
        data.raw = content
        data.$ = cheerio.load(data.raw)
      } else {
        await this.default.request(page, data)
      }
    } catch (err) {
      error = err
      logger.error(`[${id}|请求错误] ${error.message}`, url)
    }
    done(error, data)
  }

  // 初始化队列
  _initQueue(concurrency: number) {
    this._queue = fastq(this, this._worker, concurrency)
    // this._queue.empty = this._updateReadyExitTimer.bind(this)
    this._queue.drain = this._updateReadyExitTimer.bind(this)
    this.pause()
  }

  // 页面回调
  _getPageCallback(page: Page) {
    return (
      page.callback ||
      this._callback ||
      (this._eventTypeCount ? noop : undefinedCallback)
    )
  }

  // 页面回调封装emit事件
  _getPageCallbackWrapper(page: Page): Callback {
    return (err, data) => {
      this._getPageCallback(page)(err, data)
      if (err) {
        this._emitter.emit('error', err, data)
      } else {
        this._emitter.emit('data', data)
        this._emitter.emit(`data.${page.type}`, data)
        if (page.tag) {
          this._emitter.emit(`data#${page.tag}`, data)
        }
      }
    }
  }

  on<T extends string | symbol>(event: T, listener: Listener<T>) {
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

  callback(callback: Callback) {
    this._callback = callback
    return this
  }

  filter(filter: Filter) {
    this._filter = filter
    return this
  }

  add(page: Page | Page[]) {
    let pages = Array.isArray(page) ? page : [page]
    pages = pages.filter(this._filter)
    pages.forEach(page => {
      if (page.method === 'POST' && page.javascript) {
        logger.error(`[不支持的参数] 动态页面加载只支持 GET 请求`, page.url)
        return
      }
      if (!page.timeout) page.timeout = this._timeout
      if (!page.proxy) page.proxy = this._proxy
      page.id = this._pageId++
      page.headers = Object.assign({}, this._headers, page.headers)
      this._queue.push(page, this._getPageCallbackWrapper(page))
    })
    clearTimeout(this._readyExitTimer)
    return this
  }

  addPage(page: PageOptions | PageOptions[]) {
    let pages = Array.isArray(page) ? page : [page]
    this.add(pages.map(options => new Page(options)))
    return this
  }

  start() {
    this._queue.resume()
  }

  pause() {
    this._queue.pause()
  }

  stop() {
    return this._queue.kill()
  }
}
