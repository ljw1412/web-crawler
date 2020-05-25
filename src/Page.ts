import { Callback, PageOptions, RequsetHeaders } from './base'
import Crawler from './Crawler'

export default class Page {
  crawler!: Crawler
  type!: string
  url!: string
  marker!: Record<string, any>
  tag?: string
  callback?: Callback
  timeout?: number
  headers!: RequsetHeaders
  // 是否启用javascript(即使用无头浏览器进行页面加载，实现获取动态网页数据)
  javascript!: boolean

  constructor(options: PageOptions) {
    const {
      type,
      url,
      tag,
      callback,
      timeout,
      javascript = false,
      marker = {},
      headers = {}
    } = options

    this.type = type
    this.url = url
    this.tag = tag
    this.callback = callback
    this.marker = marker
    this.timeout = timeout
    this.headers = headers
    this.javascript = javascript
  }
}