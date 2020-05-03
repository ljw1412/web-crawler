import { Crawler, Page } from '@/index'

const c = new Crawler()

c.add(
  new Page({
    type: 'list',
    url: 'https://www.baidu.com',
    callback: (err, data) => {
      console.log(data)
    }
  })
)

// console.log(c)
c.start()
