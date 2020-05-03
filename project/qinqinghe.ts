import { Crawler, Page } from '@/index'

const c = new Crawler()

c.add(new Page({ type: 'list', url: 'https://www.baidu.com' }))

console.log(c)
