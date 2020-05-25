# @ljw1412/web-crawler

[![npm version](https://img.shields.io/npm/v/@ljw1412/web-crawler?style=flat-square)](https://www.npmjs.com/package/@ljw1412/web-crawler)

这是一个爬虫库(一时兴起写的)。

顺便学习`Typescript` 、以及对项目架构的思考。

- 功能
  - [x] TS支持
  - [x] 可以并发爬取
  - [x] 自由处理返回数据
  - [x] 允许自定义使用网络库(默认使用`superagent`)
  - [x] 自定义请求头
  - [x] 动态页面的数据爬取
  - [ ] 更多请求方法
  - [ ] 请求代理
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
  const { type, url, timeout, headers } = page
  const data = { raw: '', page }
  let error = null
  try {
    logger.info('[发起请求]', url)
    const options = { timeout, headers }
    if (type === 'image') options.responseType = 'arraybuffer'
    const resp = await axios.get(url, options)
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
      case 'image':
        data.buffer = resp.data
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

## 自定义请求头
```javascript
const c = new Crawler({
  concurrency: 5,
  // 设置默认的请求头，所有被添加的Page都会使用。
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
  }
})

const page = new Page({
  type: 'image',
  url: 'XXX',
  // 设置页面特有的请求头，将与默认请求头进行合并。
  // 优先级高于默认请求头(即同名属性将覆盖默认请求头)。
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0',
    Referer: 'https://localhost'
  }
})
```

## 动态页面爬取

现在很多页面都是用了`SPA`(如：react、vue等)。此时使用普通请求的方式去获取页面数据，会出现页面节点未渲染的情况。

此时你可以将Page的javascript设置为`true`，此时该请求将会以无头浏览器的模式去加载页面（因为会执行页面脚本代码因此性能会有所下降）。

```js
import { Crawler, Page, logger } from '../src/index'

const c = new Crawler()

c.add(
  new Page({
    type: 'html',
    url: 'https://www.baidu.com',
    javascript: true,
    callback: (err, { page, raw, $ }) => {
      if (err) {
        logger.error(err.message)
        return
      }
      logger.success('[请求成功]', raw)
    }
  })
)

c.start()
```