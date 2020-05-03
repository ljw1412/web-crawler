import Page from '@/classes/Page'

declare global {
  namespace WebCrawler {
    type Callback = (resp: any, page: Page) => void
  }
}
