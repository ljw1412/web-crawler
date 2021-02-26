import { Callback, PageOptions, RequsetHeaders } from './base'
import Emitter from '../utils/emitter'

export default class Page {
  id: number = -1
  type!: string
  url!: string
  marker!: Record<string, any>
  tag?: string
  callback?: Callback
  timeout?: number
  headers!: RequsetHeaders
  proxy!: string
  emitter!: Emitter
  // 请求方法和数据
  method!: 'GET' | 'POST'
  // GET请求参数
  query?: string | object
  // POST 请求参数
  data?: string | object

  constructor(options: PageOptions) {
    const {
      type,
      url,
      tag,
      callback,
      timeout,
      marker = {},
      headers = {},
      proxy = '',
      method = 'GET',
      query,
      data
    } = options

    this.type = type
    this.url = url
    this.tag = tag
    this.callback = callback
    this.marker = marker
    this.timeout = timeout
    this.headers = headers
    this.proxy = proxy
    this.method = method
    this.query = query
    this.data = data
  }
}
