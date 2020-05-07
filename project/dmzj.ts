import { Crawler, Page, logger } from '../src/index'
import path from 'path'
import fs from 'fs'
const fsp = fs.promises

const baseDir = path.join(__dirname, '../output/dmzj')

fsp.mkdir(baseDir, { recursive: true })

const c = new Crawler({ concurrency: 10 })

c.callback((err, { raw, page }) => {
  if (err) {
    logger.error(`[Error] URL=${page.url}\n`, err)
    return
  }
  logger.success('[请求完成]', page.url)
  fsp.writeFile(path.join(baseDir, page.marker.index + '.json'), raw)
})

for (let i = 1; i < 54100; i++) {
  c.add(
    new Page({
      type: 'json',
      url: `http://v3api.dmzj.com/comic/comic_${i}.json`,
      marker: { index: i }
    })
  )
}

c.start()
