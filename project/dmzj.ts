import { Crawler, Page } from '../src/index'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
const fsp = fs.promises

const baseDir = path.join(__dirname, '../output/dmzj')

fsp.mkdir(baseDir, { recursive: true })

const c = new Crawler({ concurrency: 10 })

c.callback((err, { text, page }) => {
  if (err) {
    console.log(chalk.red('[Error] URL=', page.url, '\n'), err)
    return
  }
  console.log('[请求完成]', page.url)
  fsp.writeFile(path.join(baseDir, page.marker.index + '.json'), text)
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
