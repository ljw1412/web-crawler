import { Crawler, Page, logger } from '../src/index'
import path from 'path'
import fs from 'fs'
const fsp = fs.promises

const baseDir = path.join(__dirname, '../output/dmzj')

fsp.mkdir(baseDir, { recursive: true })

const c = new Crawler({ concurrency: 10 })

c.callback((err, { raw, page, cookie }) => {
  if (err) {
    logger.error(`[Error] URL=${page.url}\n`, err)
    return
  }
  logger.success('[请求完成]', page.url)
  logger.success('[cookie]', cookie)
  fsp.writeFile(path.join(baseDir, page.marker.index + '.json'), raw)
})

c.add(
  new Page({
    type: 'html',
    url: `https://www.zerobyweva.com/plugin.php?id=jameson_manhua&c=index&a=bofang&kuid=7143`,
    proxy: 'http://localhost:1086'
  })
)

c.start()
