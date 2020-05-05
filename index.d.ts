import fastq from 'fastq'

declare namespace WebCrawler {
  interface CallbackData {
    raw: string
    page: Page
    $?: CheerioSelector
    json?: Record<string, any> | null
    [key: string]: any
  }

  type Callback = (err: Error | null, data: CallbackData) => void

  type Filter = (page: Page) => boolean

  type Queue = fastq.queue

  type RequestWorker = fastq.worker<Crawler>

  interface BaseOptions {
    timeout?: number
    callback?: Callback
  }

  interface CrawlerOptions extends BaseOptions {
    concurrency?: number
    worker?: RequestWorker
  }

  interface PageOptions extends BaseOptions {
    type: string
    url: string
    marker?: Record<string, any>
  }

  class Page {
    type: string
    url: string
    marker: Record<string, any>
    callback?: Callback
    timeout?: number
    constructor(options: PageOptions)
  }

  class Crawler {
    _queue: Queue
    _concurrency: number
    _timeout: number
    _filter: Filter
    _callback?: Callback
    constructor(options?: CrawlerOptions)
    _initQueue(worker: RequestWorker, concurrency: number): void
    _getPageCallback(page: Page): Callback
    timeout(timeout: number): this
    callback(callback: Callback): this
    filter(filter: Filter): this
    add(page: Page | Page[]): this
    start(): void
    pause(): void
    stop(drain: boolean): any
  }

  const logger: {
    info: (tag: string, ...data: any[]) => void
    warn: (tag: string, ...data: any[]) => void
    error: (tag: string, ...data: any[]) => void
    success: (tag: string, ...data: any[]) => void
  }
}

export = WebCrawler
