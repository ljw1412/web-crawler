import Page from '@/classes/Page'

declare global {
  namespace WebCrawler {
    type Done = { html?: any; page: Page; [key: string]: any }
    type Callback = (err: Error | null, done: Done) => void
    type Filter = (page: Page) => boolean
  }
}
