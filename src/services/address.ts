/* 地址相关的API */

import type { AddressParams } from '@/types/address'
import { http } from '@/utils/http'

// 添加收货地址
export const postMemberAddressAPI = (data: AddressParams) => {
  return http({
    method: 'POST',
    url: '/member/address',
    data,
  })
}
