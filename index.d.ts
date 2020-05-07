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
    tag?: string
    marker?: Record<string, any>
  }

  class Page {
    type: string
    url: string
    marker: Record<string, any>
    tag?: string
    callback?: Callback
    timeout?: number
    constructor(options: PageOptions)
  }

  class Crawler {
    constructor(options?: CrawlerOptions)
    on(event: 'error', listener: (error: Error) => void): this
    on(event: string | symbol, listener: (data: CallbackData) => void): this
    off(event: string | symbol, listener: (args: any) => void): this
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
