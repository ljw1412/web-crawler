import { Page } from 'puppeteer'
import request from 'superagent'
import WebSocket from 'ws'
import cdp from './cdp'

async function getCookies(endpoint: string, targetId: string) {
  const ws = new WebSocket(endpoint, {
    perMessageDeflate: false,
    maxPayload: 180 * 4096 // 0.73728Mb
  })
  await new Promise(resolve => ws.once('open', resolve))
  // Attach to target then get cookies
  const sessionId = await cdp.Target.attachToTarget(ws, targetId)
  return await cdp.Network.getCookies(ws, sessionId)
}

async function useProxy(page: Page, proxy: string) {
  await page.setRequestInterception(true)
  page.on('request', async req => {
    // @ts-ignore
    const endpoint = req._client._connection._url
    // @ts-ignore
    const targetId = req._frame._id
    const cookies = await getCookies(endpoint, targetId)

    try {
      const res = await request(req.method(), req.url())
        .send(req.postData())
        .set(req.headers())
        .set('Cookie', cookies)
        .responseType('buffer')
        .proxy(proxy)
      await req.respond({
        status: res.status,
        headers: res.header,
        body: res.body
      })
    } catch (error) {
      await req.abort()
    }
  })
}

export default useProxy
