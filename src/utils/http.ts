/* 添加拦截器：
    拦截 request 请求
    拦截 uploadFile 文件上传

TODO：
    1. 非 http 开头需拼接地址
    2. 请求超时
    3. 添加小程序端请求头表示
    4. 添加 token 请求头标识 
*/

import { useMemberStore } from '@/stores'

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net/'

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1. 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 2. 请求超时，默认是60s（太长）
    options.timeout = 10000 // 单位是毫秒
    console.log(options)
    // 3. 添加小程序端请求头表示
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    // 4. 添加 token 请求头标识
    // 获取Store
    const memberStore = useMemberStore()
    // 提取token
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
  },
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)
