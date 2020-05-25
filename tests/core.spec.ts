import { Crawler, Page, logger } from '@/index'
import assert from 'assert'

declare module 'mocha' {
  interface Context {
    crawler: Crawler
  }
}

describe('Crawler', function() {
  this.timeout(10000)

  beforeEach(function() {
    this.crawler = new Crawler()
  })

  it('[crawler.add] add a page.', async function() {
    this.crawler.add(
      new Page({
        type: 'html',
        url: 'http://www.baidu.com',
        callback: (err, { $ }) => {
          if (err) {
            return assert(false, err)
          }
          if (!$) return assert(false, '$ is undefined.')
          const title = $('title').text()
          assert(title.includes('百度'))
        }
      })
    )
    this.crawler.start()
  })

  it('[crawler.addPage] add a page.', async function() {
    this.crawler.addPage({
      type: 'html',
      url: 'http://www.baidu.com',
      callback: (err, { $ }) => {
        if (err) {
          return assert(false, err)
        }
        if (!$) return assert(false, '$ is undefined.')
        const title = $('title').text()
        assert(title.includes('百度'))
      }
    })
    this.crawler.start()
  })
})
