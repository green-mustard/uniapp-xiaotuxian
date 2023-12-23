import type { PageParams } from '@/types/global'
import { http } from '@/utils/http'

/* 通用推荐类型
  @params url 请求地址
  @params data 请求参数
*/
type HotParams = PageParams & { subType?: string }
export const getHotRecommendAPI = (url: string, data?: HotParams) => {
  return http({
    method: 'GET',
    url,
    data,
  })
}
