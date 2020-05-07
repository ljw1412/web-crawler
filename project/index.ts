import { Crawler, Page, logger } from '../src/index'
import { CallbackData } from 'src/base'

function createPage(tag: 'list' | 'detail', url: string) {
  return new Page({ type: 'html', tag, url })
}

// { concurrency: 5 }
const c = new Crawler()

c.on('data', ({ page, $ }: CallbackData) => {
  logger.success('data', page.url)
  if (page.tag === 'list' && $) {
    $('.entry-title a[rel="bookmark"]').each(function(index, el) {
      c.add(createPage('detail', el.attribs.href))
    })
    const nextPageBtn = $('.next.page-numbers').get(0)
    if (nextPageBtn) {
      c.add(createPage('list', nextPageBtn.attribs.href))
    }
  }
})
  .on('data.html', ({ page }) => {
    logger.success('data.html', page.url)
  })
  .on('data#list', ({ page }) => {
    logger.success('data#list', page.url)
  })
  .on('data#detail', ({ page }) => {
    logger.success('data#detail', page.url)
  })
  .on('error', ({ page }) => {
    logger.error('error', page.url)
  })
  .add(createPage('list', 'http://qinqinghe.com/category/jingdian/'))
  .start()
