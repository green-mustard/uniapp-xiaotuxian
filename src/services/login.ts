// 小程序登录的API
import { http } from '@/utils/http'

type loginParams = {
  code: string
  encryptedData: string
  iv: string
}
export const loginWxMinAPI = (data: loginParams) => {
  return http({
    method: 'POST',
    url: '/login/wxMin',
    data,
  })
}

// 小程序模拟登录的API
export const loginWxMinSimpleAPI = (phoneNumber: string) => {
  return http({
    method: 'POST',
    url: '/login/wxMin/simple',
    data: {
      phoneNumber,
    },
  })
}
