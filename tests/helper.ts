import axios, { AxiosRequestConfig } from 'axios'
import proxyAgent from 'proxy-agent'
import { Page, logger } from '@/index'
import cheerio from 'cheerio'
import { CallbackData } from '@/base'

export async function axiosRequest(page: Page, data: CallbackData) {
  const { id, type, url, timeout, headers, proxy } = page
  const options: AxiosRequestConfig = { timeout, headers }
  if (['image', 'file'].includes(type)) options.responseType = 'arraybuffer'
  if (proxy) {
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
