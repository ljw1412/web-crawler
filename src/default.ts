import cheerio from 'cheerio'
import request from 'superagent'
import { CallbackData } from './base'
import Page from './Page'
import logger from './utils/logger'

require('superagent-proxy')(request)

export function noop() {}

// superagent请求
export async function superagentRequest(page: Page, data: CallbackData) {
  const { id, type, url, timeout, headers, proxy } = page
  logger.info(`[${id}|发起请求]superagent:`, url)
  const req = request
    .get(url)
    .timeout(timeout!)
    .set(headers)
  if (proxy) {
    req.proxy(proxy)
    logger.warn(`[${id}|请求代理]`, url, '->', proxy)
  }
  const resp = await req
  // 数据处理组装到data
  switch (type) {
    case 'html':
      data.raw = resp.text
      data.$ = cheerio.load(data.raw)
      break
    case 'json':
      data.raw = resp.text
      try {
        data.json = JSON.parse(data.raw)
      } catch (err) {
        logger.error(`[${id}|JSON解析错误]`, data.page.url, '\n', err)
      }
      break
    case 'image':
    case 'file':
      data.buffer = resp.body
      break
  }
}

// 未定义回调的错误提示
export function undefinedCallback(err: Error | null, { page }: CallbackData) {
  logger.error(`[${page.id}|回调错误]`, '没有进行回调处理:\n', page)
}
