import type { CategoryItem } from '@/types/home'
import { http } from '@/utils/http'

// 分类列表的请求接口
export const getCategoryAPI = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: '/category/top',
  })
}
