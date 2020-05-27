import fastq from 'fastq'
import Page from './Page'
import Crawler from './Crawler'
import { LaunchOptions } from 'puppeteer'

export interface CallbackData {
  raw: string
  page: Page
  $?: CheerioSelector
  json?: Record<string, any> | null
  buffer?: Buffer
  [key: string]: any
}

export type Callback = (err: Error | null, data: CallbackData) => void

export type Filter = (page: Page) => boolean

export type Queue = fastq.queue

export type Listener<T> = T extends 'error'
  ? (error: Error, data: CallbackData) => void
  : (data: CallbackData) => void

export interface RequsetHeaders {
  Referer?: string
  Cookie?: string
  Origin?: string
  'User-Agent'?: string
  [k: string]: any
}

interface BaseOptions {
  timeout?: number
  proxy?: string
  headers?: RequsetHeaders
  callback?: Callback
}

export interface CrawlerOptions extends BaseOptions {
  concurrency?: number
  browerConfig?: LaunchOptions
}

export interface PageOptions extends BaseOptions {
  type: 'html' | 'image' | 'file' | 'json' | string
  url: string
  javascript?: boolean
  tag?: string
  marker?: Record<string, any>
}

export const version: string = require('../package.json').version
