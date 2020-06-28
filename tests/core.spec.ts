import { Crawler, Page, logger } from '@/index'
import { axiosRequest } from './helper'
import assert from 'assert'

declare module 'mocha' {
  interface Context {
    crawler: Crawler
  }
}

describe('Crawler', function() {
  this.timeout(25000)

  beforeEach(function() {
    this.crawler = new Crawler()
  })

  it('[add]使用 crawler.add 添加一个页面', async function() {
    await new Promise((resolve, reject) => {
      this.crawler.add(
        new Page({
          type: 'html',
          url: 'http://www.baidu.com',
          callback: (err, { $ }) => {
            if (err) {
              reject(err)
              return assert(false, err)
            }
            if (!$) return assert(false, '$ is undefined.')
            const title = $('title').text()
            assert(title.includes('百度'))
            resolve()
          }
        })
      )
      this.crawler.start()
    })
  })

  it('[addPage]使用 crawler.addPage 添加一个页面', async function() {
    await new Promise((resolve, reject) => {
      this.crawler.addPage({
        type: 'html',
        url: 'http://www.baidu.com',
        callback: (err, { $ }) => {
          if (err) {
            reject(err)
            return assert(false, err)
          }
          if (!$) return assert(false, '$ is undefined.')
          const title = $('title').text()
          assert(title.includes('百度'))
          resolve()
        }
      })
      this.crawler.start()
    })
  })

  it('[Query]使用带参数的 GET 请求', async function() {
    await new Promise((resolve, reject) => {
      this.crawler.addPage({
        type: 'json',
        url: 'http://api.isoyu.com/api/News/new_list',
        query: { type: 1, page: 1 },
        callback: (err, { json }) => {
          if (err) {
            reject(err)
            return assert(false, err)
          }
          if (!json) return assert(false, 'json is undefined.')
          assert(json.msg === 'success')
          resolve()
        }
      })
      this.crawler.start()
    })
  })

  it('[Data]使用带参数的 POST 请求', async function() {
    await new Promise((resolve, reject) => {
      this.crawler.addPage({
        type: 'json',
        url:
          'https://manga.bilibili.com/twirp/comic.v1.Comic/HomeRecommend?device=pc&platform=web',
        method: 'POST',
        data: { page_num: 1, platform: 'phone', seed: 1, drag: 0 },
        callback: (err, { json }) => {
          if (err) {
            reject(err)
            return assert(false, err)
          }
          if (!json) return assert(false, 'json is undefined.')
          assert(json.code === 0)
          resolve()
        }
      })
      this.crawler.start()
    })
  })

  it('[custom]自定义请求', async function() {
    this.crawler.default.request = axiosRequest

    await new Promise((resolve, reject) => {
      this.crawler.addPage({
        type: 'html',
        url: 'http://www.baidu.com',
        callback: (err, { $ }) => {
          if (err) {
            reject(err)
            return assert(false, err)
          }
          if (!$) return assert(false, '$ is undefined.')
          const title = $('title').text()
          assert(title.includes('百度'))
          resolve()
        }
      })
      this.crawler.start()
    })
  })

  it('[custom&proxy]自定义请求且设置代理', async function() {
    this.crawler.default.request = axiosRequest

    await new Promise((resolve, reject) => {
      this.crawler.addPage({
        type: 'html',
        url: 'http://www.google.com',
        proxy: 'http://127.0.0.1:1087',
        callback: (err, { $ }) => {
          if (err) {
            reject(err)
            return assert(false, err)
          }
          if (!$) return assert(false, '$ is undefined.')
          const title = $('title').text()
          assert(title.includes('Google'))
          resolve()
        }
      })

      this.crawler.start()
    })
  })

  it('[proxy]设置 crawler.proxy', async function() {
    const c = new Crawler({ proxy: 'socks5://127.0.0.1:1086' })

    await new Promise((resolve, reject) => {
      c.addPage({
        type: 'html',
        url: 'https://www.google.com',
        callback: (err, { $ }) => {
          if (err) {
            reject(err)
            return assert(false, err)
          }
          if (!$) return assert(false, '$ is undefined.')
          const title = $('title').text()
          assert(title.includes('Google'))
          resolve()
        }
      })
      c.start()
    })
  })

  it('[proxy]设置 page.proxy', async function() {
    await new Promise((resolve, reject) => {
      this.crawler.addPage({
        type: 'html',
        url: 'https://www.google.com',
        proxy: 'socks5://127.0.0.1:1086',
        callback: (err, { $ }) => {
          if (err) {
            reject()
            return assert(false, err)
          }
          if (!$) return assert(false, '$ is undefined.')
          const title = $('title').text()
          assert(title.includes('Google'))
          resolve()
        }
      })
      this.crawler.start()
    })
  })
})
