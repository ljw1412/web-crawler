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
  - [X] 请求代理
  - [X] 简单的插件扩展支持
  - [ ] 更多请求方法
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

除了使用`callback`进行结果回调处理外你还可以使用`on`/`off`进行事件处理。

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

## 自定义网络库
```javascript
const axios = require('axios')
const cheerio = require('cheerio')
import proxyAgent from 'proxy-agent'
const { Crawler, Page, logger } = require('@ljw1412/web-crawler')

const c = new Crawler()

function axiosRequest(page, data) {
  const { id, type, url, timeout, headers, proxy } = page
  const options = { timeout, headers }
  if (['image', 'file'].includes(type)) options.responseType = 'arraybuffer'
  if (proxy) {
    // 请求代理处理
    options.httpAgent = new proxyAgent(proxy)
    options.httpsAgent = new proxyAgent(proxy)
    logger.warn('[请求代理]', url, '->', proxy)
  }

  logger.info(`[${id}|发起请求]axios:`, url)
  const resp = await axios.get(url, options)
  data.raw = resp.data

  switch (type) {
    case 'html':
      data.$ = cheerio.load(data.raw)
      break
    case 'json':
      try {
        data.json = JSON.parse(data.raw)
      } catch (err) {
        logger.error(`[${id}|JSON解析错误]`, data.page.url, '\n', err)
      }
      break
    case 'image':
    case 'file':
      data.buffer = resp.data
      break
  }
}

// 覆盖默认请求方法
c.default.request = axiosRequest

c.add(new Page({ type: 'html', url: 'http://www.google.com' }))

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

现在很多页面都是用了`SPA`。此时使用普通请求的方式去获取页面数据，会出现页面节点未渲染的情况。

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

## 代理请求

```js
// 为全局设置默认代理，向该爬虫队列添加页面时，如果未设置页面代理，那么页面会使用默认代理。
new Crawler({proxy: 'socks5://127.0.0.1:1086'})

// 为单个页面设置代理，优先级高于全局默认代理。
// javascript 动态模式暂不支持代理请求。
new Page({
  type: 'html',
  url: 'https://www.google.com',
  proxy: 'socks5://127.0.0.1:1086'
})
```

----

## API

### new Page([options])

创建一个页面实例。

参数:
- options
  - timeout      超时时间(ms)，默认值 `20 * 1000`。
  - headers      设置请求头。
  - callback     请求完成后的回调 `(err, data) => void`。
  - type         页面类型(`html, image, file, json`或自定义字符串)。
  - url          页面资源地址。
  - javascript   是否加载页面的js。
  - tag          标签，用于回调标记。
  - marker       自定义标记数据对象。

### new Crawler([options])

创建一个新的爬虫实例。

参数:
- options 爬虫基础配置(对象的属性均为选填)。
  - timeout      超时时间(ms)，默认值 `20 * 1000`。
  - headers      设置请求头
  - callback     请求完成后的回调 `(err, data) => void`。
  - concurrency  允许的并发数量
  - worker       自定义请求方法 `(page, done) => void`，最后使用执行回调`done(err, data)`。
  - browerConfig 同`puppeteer.launch([options])`中的`options`。

### Crawler.use(plugin)

- @param `plugin` <(Crawler) => void>

### crawler.on(event,listener)

### crawler.off(event,listener)

- @param `event` \<string> 
- @param `listener` \<Function>
- @return `this` \<Crawler>

事件绑定/解绑，使用方法见[监听绑定](#监听绑定)。

### crawler.timeout(timeout)

- @param `timeout` \<number>
- @return `this` \<Crawler>

设置超时时间，单位毫秒(ms)。但是优先级低于`Page`实例中的`timeout`。

可以在运行时进行修改，对后面添加的页面有效。

### crawler.callback(callback)

- @param `callback` (err, data) => void
- @return `this` \<Crawler>

设置回调方法，格式同构造函数传参的`options.callback`。但是优先级低于`Page`实例中的`callback`。

可以在运行时进行修改，对后面添加的页面有效。

### crawler.filter(filter)
- @param `filter` (page: Page) => boolean
- @return `this` \<Crawler>

设置过滤方法。返回值为false将不会加入爬虫队列。可以在运行时进行修改，对后面添加的页面有效。

### crawler.add(page) 
- @param page \<Page>
- @return `this` \<Crawler>
### crawler.add(pages)
- @param page \<Page[]>
- @return `this` \<Crawler>

向队列中添加请求一个或多个页面([`Page`](#api))。

### crawler.addPage(pageOptions)
- @param pageOptions \<PageOptions>
- @return `this` \<Crawler>
### crawler.addPage(pagesOptions)
- @param pagesOptions \<PageOptions[]>
- @return `this` \<Crawler>

向队列中添加请求一个或多个页面。这里传的是Page构造器的参数而不是Page实例。

### crawler.start()

开始爬取。

### crawler.pause()

暂停爬取。

### crawler.stop()

停止爬取。

---

## 插件

[web-crawler-axios-plugin](https://github.com/ljw1412/web-crawler-axios-plugin)