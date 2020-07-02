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
  // 是否启用javascript(即使用无头浏览器进行页面加载，实现获取动态网页数据)
  javascript!: boolean
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
      javascript = false,
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
    this.javascript = javascript
    this.proxy = proxy
    this.method = method
    this.query = query
    this.data = data
  }
}
