import { Crawler, Page, logger } from '../src/index'
import path from 'path'
import URL from 'url'
import fs from 'fs'
const fsp = fs.promises

const baseDir = path.join(__dirname, '../output/qinqinghe')

fsp.mkdir(baseDir, { recursive: true })

function createPage(type: 'list' | 'detail', url: string) {
  return new Page({ type: 'html', marker: { type }, url })
}

const c = new Crawler({ concurrency: 5 })

c.callback((err, { raw, $, page }) => {
  if (err) {
    logger.error(`[Error] URL=${page.url}\n`, err)
    return
  }
  logger.success(`[请求完成] *${page.marker.type}`, page.url)
  if (page.marker.type === 'list' && $) {
    $('.entry-title a[rel="bookmark"]').each(function(index, el) {
      c.add(createPage('detail', el.attribs.href))
    })
    const nextPageBtn = $('.next.page-numbers').get(0)
    if (nextPageBtn) {
      c.add(createPage('list', nextPageBtn.attribs.href))
    }
  } else if (page.marker.type === 'detail' && raw) {
    const url = URL.parse(page.url)
    const filepath = path.join(baseDir, url.pathname!)
    fsp.writeFile(filepath, raw)
    logger.success(`[写入完成]`, filepath)
  }
})

c.add(createPage('list', 'http://qinqinghe.com/category/jingdian/'))

c.start()
