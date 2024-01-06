/* 地址相关的API */

import type { AddressItem, AddressParams } from '@/types/address'
import { http } from '@/utils/http'

// 添加收货地址
export const postMemberAddressAPI = (data: AddressParams) => {
  return http({
    method: 'POST',
    url: '/member/address',
    data,
  })
}

// 获取收获地址列表
export const getAddressListAPI = () => {
  return http<AddressItem[]>({
    method: 'GET',
    url: '/member/address',
  })
}
