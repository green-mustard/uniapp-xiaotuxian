import { http } from '@/utils/http'

// 商品详情接口
export const getGoodsByIdAPI = (id: string) => {
  return http({
    method: 'GET',
    url: '/goods',
    data: {
      id,
    },
  })
}
