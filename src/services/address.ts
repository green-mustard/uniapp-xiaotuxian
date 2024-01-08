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

// 获取收货地址列表
export const getAddressListAPI = () => {
  return http<AddressItem[]>({
    method: 'GET',
    url: '/member/address',
  })
}

// 获取收货地址详情
export const getAddressByIdAPI = (id: string) => {
  return http({
    method: 'GET',
    url: `/member/address/${id}`,
  })
}

// 修改收货地址
export const changeAddressAPI = (id: string, data: AddressParams) => {
  return http({
    method: 'PUT',
    url: `/member/address/${id}`,
    data,
  })
}
