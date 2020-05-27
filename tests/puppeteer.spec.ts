import assert from 'assert'
import Browser from '@/Browser'
import Page from '@/Page'

const browser = new Browser()

describe('Browser', function() {
  this.timeout(10000)
  it('getSourceCode', async function() {
    await browser.init()
    const content = await browser.getSourceCode(
      new Page({ type: 'html', url: 'https://www.baidu.com' })
    )
    await browser.destroy()
    assert(content.includes('value="百度一下"'))
  })
})
