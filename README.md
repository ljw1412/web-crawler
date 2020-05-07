# @ljw1412/web-crawler

这是一个爬虫库(一时兴起写的)。

顺便学习`Typescript` 、以及对项目架构的思考。

- 功能
  - [x] TS支持
  - [x] 可以并发爬取
  - [x] 自由处理返回数据
  - [x] 允许自定义使用网络库(默认使用`superagent`)
  - [ ] 请求代理
  - [ ] 自定义请求头
  - 其他功能构思中……

## 安装
```sh
# 使用 npm
npm install @ljw1412/web-crawler
# 使用 yarn
yarn add @ljw1412/web-crawler
```

## 基础用法
```javascript
const { Crawler, Page, logger } = require('@ljw1412/web-crawler')

// 默认并发数(concurrency)为1
const c = new Crawler({ concurrency: 5 })

// 设置默认回调事件
c.callback((err, { page, raw, $ }) => {
  if (err) {
    logger.error('错误', page.url, err)
  } else if ($) {
    // $ 采用 cheerio，一个专为服务端设计的实现jquery核心功能的包
    logger.info('[title]', $('title').text())
  }
})

// 添加需要爬取的页面
c.add(new Page({ type: 'html', url: 'https://jd.com' }))
// 以Page数组的形式添加
c.add([
  new Page({ type: 'html', url: 'https://www.tmall.com' }),
  new Page({ type: 'html', url: 'https://www.taobao.com' })
])
// 也可以单独设置回调事件
c.add(
  new Page({
    type: 'html',
    url: 'http://www.amazon.com',
    // 更加细致的回调处理，优先级高于默认回调(此时不会走默认回调)。
    callback: (err, { page, raw, $ }) => {
      if (err) {
        logger.error('错误', page.url, err)
      } else if ($) {
        // $ 采用 cheerio，一个专为服务端设计的实现jquery核心功能的包
        logger.info('[Good Luck!]', $('title').text())
      }
    }
  })
)

// 开始爬取
c.start()
```

## 监听绑定

除了使用`callback`进行结果回调处理外你还可以使用`on`,`off`进行事件处理。

- event:
  - data
  - data.{type}
  - data#{tag}
  - error

```javascript
const { Crawler, Page, logger } = require('@ljw1412/web-crawler')

const c = new Crawler()

c.add([new Page({ type: 'html', url: 'https://jd.com' }),
  new Page({ type: 'html', url: 'https://www.tmall.com' }),
  new Page({ type: 'html', tag: 'no-money', url: 'https://www.taobao.com' })
])

// 监听所有的成功回调
c.on('data', ({ page, raw, $ }) => {
  if ($) {
    logger.success('[data]', $('title').text())
  }
})

// 监听 page.type === 'html' 的成功回调
c.on('data.html', ({ page, raw, $ }) => {
  if ($) {
    logger.success('[data.html]', $('title').text())
  }
})

// 监听 tag === 'no-money' 的成功回调
c.on('data#no-money', ({ page, raw, $ }) => {
  if ($) {
    logger.success('[data#no-money]', $('title').text())
  }
})

// 监听所有的错误
c.on('error', error => {
  logger.error('[error]', page.url, error)
})

c.start()
```

## 自定义worker，并使用其他网络库
```javascript
const axios = require('axios')
const cheerio = require('cheerio')
const { Crawler, Page, logger } = require('@ljw1412/web-crawler')

// done 是一个完成方法，对应用户设置的 callback
// done(error, data)
const worker = async (page, done) => {
  const { type, url, timeout } = page
  const data = { raw: '', page }
  let error = null
  try {
    logger.info('[发起请求]', url)
    const resp = await axios.get(url, { timeout })
    data.raw = resp.data
    // 根据类型新增data内的属性
    switch (type) {
      case 'html':
        data.$ = cheerio.load(data.raw)
        break
      case 'json':
        try {
          data.json = JSON.parse(data.raw)
        } catch (err) {
          logger.error('[JSON解析错误]', data.page.url, '\n', err)
        }
        break
    }
  } catch (err) {
    error = err
    logger.error('[请求错误]', url, '\n', err)
  }

  done(error, data)
}

const c = new Crawler({ worker })

c.add(new Page({ type: 'html', url: 'https://jd.com' }))

c.callback((err, { page, raw, $ }) => {
  if (err) {
    logger.error('错误', page.url, err)
  } else if ($) {
    logger.info('[title]', $('title').text())
  }
})

c.start()
```