import type { GoodsResult } from '@/types/goods'
import { http } from '@/utils/http'

// 商品详情接口
export const getGoodsByIdAPI = (id: string) => {
  return http<GoodsResult>({
    method: 'GET',
    url: `/goods?id=${id}`,
    // data: {
    //   id,
    // },
  })
}
