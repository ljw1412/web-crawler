import { Crawler, Page, logger } from '../src/index'
import path from 'path'
import fs from 'fs'
const fsp = fs.promises

const baseDir = path.join(__dirname, '../output/images')

fsp.mkdir(baseDir, { recursive: true })

const c = new Crawler()

c.on('data.image', ({ page, buffer }) => {
  if (buffer) {
    fsp.writeFile(path.join(baseDir, 'cover.jpg'), buffer)
    logger.success('[保存成功]', page.url)
  }
})

c.on('error', (error, { page }) => {
  // console.log(error)
})

c.on('end', () => {
  console.log('end')
})

c.add(
  new Page({
    type: 'image',
    url:
      'https://images.dmzj.com/b/%E6%9C%AC%E5%91%A8%E7%8B%97%E7%B2%AE%E6%8E%A8%E8%8D%90/%E7%AC%AC28%E8%AF%9D_1588907457/001.jpg',
    headers: { Referer: 'https://www.dmzj.com' }
  })
)

c.start()
