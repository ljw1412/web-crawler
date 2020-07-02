import { EventEmitter } from 'events'
import logger from './logger'
import Page from '../core/Page'

export type EvnetLevel = 'error' | 'warn' | 'info' | 'success'

export interface EventStore {
  error?: Error | null
  page: Page
  [k: string]: any
}

const TAG_MAP: Record<string, string> = {
  'Crawler Start': '爬虫开始',
  'Crawler Pause': '爬虫暂停',
  'Crawler End': '爬虫结束',
  'Open Page': '打开页面',
  'Before Request': '发起请求',
  'Request Proxy': '代理请求',
  'Request Error': '请求错误',
  'Request Success': '请求成功',
  'Not Supported': '未支持',
  'Need Callback': '需要回调方法',
  SyntaxError: '语法错误'
}

export class Event {
  time!: Date
  level!: EvnetLevel
  tag!: string
  tagName!: string
  message!: string
  store?: EventStore

  constructor() {
    this.time = new Date()
  }

  set(tag: string, message: string, store?: EventStore) {
    this.tag = tag
    this.tagName = TAG_MAP[tag] || tag
    this.message = message
    this.store = store
    return this
  }

  static createEvent(level: EvnetLevel) {
    const event = new Event()
    event.level = level
    return event
  }
}

/**
 * 快速事件
 * @param level 事件级别
 * @param notEmit 事件不传递
 */
function QuickEmitBuilder(level: EvnetLevel) {
  return function(
    this: Emitter,
    tag: string,
    message: string,
    store?: EventStore
  ) {
    const event = Event.createEvent(level).set(tag, message, store)
    this.emit(`log`, event)
    this.emit(`log:${level}`, event)
    this.printConsole && logger[level](`[${event.tagName}]`, message)
  }
}

export default class Emitter extends EventEmitter {
  printConsole: boolean = false

  get _eventTypeCount() {
    return this.eventNames().length
  }

  get hasErrorListener() {
    return this.eventNames().includes('error')
  }

  errorLog = QuickEmitBuilder('error')
  warnLog = QuickEmitBuilder('warn')
  infoLog = QuickEmitBuilder('info')
  successLog = QuickEmitBuilder('success')
}
