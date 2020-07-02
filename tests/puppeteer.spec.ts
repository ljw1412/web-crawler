import assert from 'assert'
import Browser from '@/core/Browser'
import Page from '@/core/Page'
import Emitter from '@/utils/emitter'

const browser = new Browser()

describe('Browser', function() {
  this.timeout(10000)
  it('getSourceCode', async function() {
    await browser.init()
    const page = new Page({ type: 'html', url: 'https://www.baidu.com' })
    page.emitter = new Emitter()
    const content = await browser.getSourceCode(page)
    await browser.destroy()
    assert(content.includes('value="百度一下"'))
  })
})
