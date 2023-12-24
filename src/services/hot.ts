import type { PageParams } from '@/types/global'
import type { HotItem } from '@/types/home'
import { http } from '@/utils/http'

/* 通用推荐类型
  @params url 请求地址
  @params data 请求参数
*/
// &表示交叉类型，交叉类型可以基于原来的类型做一个扩展
type HotParams = PageParams & { subType?: string }
export const getHotRecommendAPI = (url: string, data?: HotParams) => {
  return http<HotItem>({
    method: 'GET',
    url,
    data,
  })
}
