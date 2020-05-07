import cheerio from 'cheerio'
import request, { Response } from 'superagent'
import { Callback, CallbackData } from './base'
import Page from './Page'
import logger from './utils/logger'

export function noop() {}

// 默认结果数据组装
export function defaultAssignData(
  data: CallbackData,
  type: string,
  resp: Response
) {
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
      break
  }
}

// 默认网络请求处理
export const defaultWorker = (
  assignData: typeof defaultAssignData = defaultAssignData
) => async (page: Page, done: Callback) => {
  const { type, url, timeout } = page
  const data: CallbackData = { raw: '', page }
  let error = null

  try {
    logger.info('[发起请求]', url)
    const resp = await request.get(url).timeout(timeout!)
    assignData(data, type, resp)
  } catch (err) {
    error = err
    logger.error('[请求错误]', url, '\n', err)
  }

  done(error, data)
}

// 未定义回调的错误提示
export function undefinedCallback(err: Error | null, { page }: CallbackData) {
  logger.error('[回调错误]', '没有进行回调处理:\n', page)
}
