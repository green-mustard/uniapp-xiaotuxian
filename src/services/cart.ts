/* 购物车相关的API */

import { http } from '@/utils/http'

// 加入购物车的API
export const addCartAPI = (data: { skuId: string; count: number }) => {
  return http({
    method: 'POST',
    url: '/member/cart',
    data,
  })
}
