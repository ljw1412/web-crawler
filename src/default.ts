import cheerio from 'cheerio'
import request from 'superagent'
import { CallbackData } from './base'
import Page from './Page'
import logger from './utils/logger'

require('superagent-proxy')(request)

export function noop() {}

// superagent请求
export async function superagentRequest(page: Page, cbData: CallbackData) {
  const { id, type, url, timeout, headers, proxy, method, data, query } = page
  logger.info(`[${id}|发起请求]superagent:`, url)
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
    logger.warn(`[${id}|请求代理]`, url, '->', proxy)
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
      } catch (err) {
        logger.error(`[${id}|JSON解析错误]`, cbData.page.url, '\n', err)
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
  logger.error(`[${page.id}|回调错误]`, '没有进行回调处理:\n', page)
}
