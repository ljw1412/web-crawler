import Page from './Page'
import logger from './utils/logger'
import { noop, defaultWorker, undefinedCallback } from './default'
import {
  RequestWorker,
  Callback,
  Filter,
  Queue,
  CrawlerOptions,
  Listener,
  RequsetHeaders
} from './base'
import fastq from 'fastq'
import { EventEmitter } from 'events'

export default class Crawler {
  private _queue!: Queue
  private _concurrency!: number
  private _timeout!: number
  private _headers!: RequsetHeaders
  private _filter: Filter = _ => true
  private _callback?: Callback
  private _emitter: EventEmitter = new EventEmitter()
  private _eventTypeCount: number = 0

  constructor(options: CrawlerOptions = {}) {
    let {
      concurrency = 1,
      worker = defaultWorker(),
      timeout = 20 * 1000,
      headers = {},
      callback
    } = options

    this._concurrency = concurrency
    this._timeout = timeout
    this._headers = headers
    this._callback = callback
    this._initQueue(worker, concurrency)
  }

  // 初始化队列
  _initQueue(worker: RequestWorker, concurrency: number) {
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

  _getPageCallbackWrapper(page: Page): Callback {
    return (err, data) => {
      if (err) {
        this._emitter.emit('error', err, data)
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
      if (!page.timeout) page.timeout = this._timeout
      page.headers = Object.assign({}, this._headers, page.headers)
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
