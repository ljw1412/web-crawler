export default class Page {
  type!: string
  url!: string
  marker!: Record<string, any>
  tag?: string
  callback?: WebCrawler.Callback
  timeout?: number

  constructor(options: WebCrawler.PageOptions) {
    const { type, url, tag, callback, timeout, marker = {} } = options
    this.type = type
    this.url = url
    this.tag = tag
    this.callback = callback
    this.marker = marker
    this.timeout = timeout
  }
}
