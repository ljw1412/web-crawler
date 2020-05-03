interface PageOptions {
  type: string
  url: string
  callback?: WebCrawler.Callback
}

export default class Page {
  type!: string
  url!: string
  callback?: WebCrawler.Callback

  constructor(options: PageOptions) {
    const { type, url, callback } = options
    this.type = type
    this.url = url
    this.callback = callback
  }
}
