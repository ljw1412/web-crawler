import fastq from 'fastq'
import Page from './Page'
import Crawler from './Crawler'

export interface CallbackData {
  raw: string
  page: Page
  $?: CheerioSelector
  json?: Record<string, any> | null
  [key: string]: any
}

export type Callback = (err: Error | null, data: CallbackData) => void

export type Filter = (page: Page) => boolean

export type Queue = fastq.queue

export type RequestWorker = fastq.worker<Crawler>

interface BaseOptions {
  timeout?: number
  callback?: Callback
}

export interface CrawlerOptions extends BaseOptions {
  concurrency?: number
  worker?: RequestWorker
}

export interface PageOptions extends BaseOptions {
  type: string
  url: string
  tag?: string
  marker?: Record<string, any>
}

export const version: string = require('../package.json').version
