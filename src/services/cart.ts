/* 购物车相关的API */

import type { CartItem } from '@/types/cart'
import { http } from '@/utils/http'
import { h } from 'vue'

// 加入购物车的API
export const addCartAPI = (data: { skuId: string; count: number }) => {
  return http({
    method: 'POST',
    url: '/member/cart',
    data,
  })
}

// 获取购物车列表的API
export const getCartListAPI = () => {
  return http<CartItem[]>({
    method: 'GET',
    url: '/member/cart',
  })
}

// 删除/清空购物车商品的API
export const deleteCartItemAPI = (data: { ids: string[] }) => {
  return http({
    method: 'DELETE',
    url: '/member/cart',
    data,
  })
}

// 修改商品数量的API
export const changeCartBySkuIdAPI = (
  skuId: string,
  data: { selected?: Boolean; count?: number },
) => {
  return http({
    method: 'PUT',
    url: `/member/cart/${skuId}`,
    data,
  })
}
