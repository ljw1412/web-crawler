import cheerio from 'cheerio'
import request from 'superagent'
import { CallbackData, CrawlerDefaultOptions } from './base'
import Page from './Page'

require('superagent-proxy')(request)

export function noop() {}

// superagent请求
export async function superagentRequest(page: Page, cbData: CallbackData) {
  const {
    id,
    type,
    url,
    timeout,
    headers,
    proxy,
    method,
    data,
    query,
    emitter
  } = page

  emitter.infoLog('Before Request', `#${id} superagent:${url}`, { page })
  let req
  // 请求方法与请求数据处理
  if (method === 'POST') {
    req = request.post(url)
    if (data) req.send(data)
  } else {
    req = request.get(url)
    if (query) req.query(query)
  }
  req.timeout(timeout!).set(headers)
  if (proxy) {
    req.proxy(proxy)
    emitter.warnLog('Request Proxy', `#${id} ${url} -> ${proxy}`, { page })
  }
  const resp = await req
  // 数据处理组装到data
  switch (type) {
    case 'html':
      cbData.raw = resp.text
      cbData.$ = cheerio.load(cbData.raw)
      break
    case 'json':
      cbData.raw = resp.text
      try {
        cbData.json = JSON.parse(cbData.raw)
      } catch (error) {
        emitter.errorLog(
          'SyntaxError',
          `#${id} ${url}\n$JSON解析错误: ${error.message}`,
          { error, page }
        )
      }
      break
    case 'image':
    case 'file':
      cbData.buffer = resp.body
      break
  }
}

// 未定义回调的错误提示
export function undefinedCallback(err: Error | null, { page }: CallbackData) {
  page.emitter.errorLog('Need Callback', '没有进行回调处理', { page })
}

/**
 * 获取默认配置
 */
export function getDefaultConfig(): CrawlerDefaultOptions {
  return {
    timeout: 20000,
    request: superagentRequest,
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
  }
}
