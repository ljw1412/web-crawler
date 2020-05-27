import cheerio from 'cheerio'
import request, { Response } from 'superagent'
import { Callback, CallbackData } from './base'
import Page from './Page'
import logger from './utils/logger'

require('superagent-proxy')(request)

export const config = {
  timeout: 20000,
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
}

export function noop() {}

// superagent结果数据组装
export function assignData(data: CallbackData, type: string, resp: Response) {
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
        logger.error('[JSON解析错误]', data.page.url, '\n', err)
      }
      break
    case 'image':
    case 'file':
      data.buffer = resp.body
      break
  }
}

async function getSourceCode(page: Page) {
  return await page.crawler.browser.getSourceCode(page)
}

// 默认网络请求处理
export const defaultWorker = async (page: Page, done: Callback) => {
  const { type, url, timeout, headers, javascript } = page

  const data: CallbackData = { raw: '', page }
  let error = null

  try {
    logger.info('[发起请求]', url)
    if (javascript) {
      const content = await getSourceCode(page)
      data.raw = content
      data.$ = cheerio.load(data.raw)
    } else {
      const req = request
        .get(url)
        .timeout(timeout!)
        .set(headers)
      if (page.proxy) {
        req.proxy(page.proxy)
        logger.warn('[请求代理]', page.url, '->', page.proxy)
      }
      const resp = await req
      assignData(data, type, resp)
    }
  } catch (err) {
    error = err
    logger.error(`[请求错误] ${error.message}`, url)
  }

  done(error, data)
}

// 未定义回调的错误提示
export function undefinedCallback(err: Error | null, { page }: CallbackData) {
  logger.error('[回调错误]', '没有进行回调处理:\n', page)
}
