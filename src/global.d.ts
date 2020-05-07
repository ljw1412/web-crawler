import fastq from 'fastq'
import Crawler from './classes/Crawler'
import Page from './classes/Page'

declare global {
  namespace WebCrawler {
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
  }
}
