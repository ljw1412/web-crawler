import { Callback, PageOptions, RequsetHeaders } from './base'

export default class Page {
  type!: string
  url!: string
  marker!: Record<string, any>
  tag?: string
  callback?: Callback
  timeout?: number
  headers!: RequsetHeaders

  constructor(options: PageOptions) {
    const {
      type,
      url,
      tag,
      callback,
      timeout,
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
  }
}
