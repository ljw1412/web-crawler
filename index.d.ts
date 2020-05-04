import fastq from 'fastq'

declare namespace WebCrawler {
  interface Done {
    html?: string
    $?: CheerioSelector
    page: Page
    [key: string]: any
  }

  type Callback = (err: Error | null, done: Done) => void

  type Filter = (page: Page) => boolean

  interface PageOptions {
    type: string
    url: string
    marker?: Record<string, any>
    timeout?: number
    callback?: WebCrawler.Callback
  }

  interface CrawlerOptions {
    concurrency: number
    worker?: fastq.worker<Crawler>
    callback?: WebCrawler.Callback
    timeout?: number
  }

  class Page {
    type: string
    url: string
    marker: Record<string, any>
    callback?: WebCrawler.Callback
    timeout?: number
    constructor(options: PageOptions)
  }

  class Crawler {
    private queue
    private callbackFn?
    private filterFn
    private timeout
    constructor(options?: CrawlerOptions)
    get size(): () => number
    get isEmpty(): boolean
    setTimeout(timeout: number): void
    callback(callback: WebCrawler.Callback): this
    filter(filter: WebCrawler.Filter): this
    getPageCallback(page: Page): WebCrawler.Callback
    add(page: Page | Page[]): this
    start(): void
    pause(): void
    stop(drain: boolean): any
  }
}

export = WebCrawler
