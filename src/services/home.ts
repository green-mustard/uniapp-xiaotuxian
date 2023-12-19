import type { BannerItem } from '@/types/home'
import { http } from '@/utils/http'

// 首页-Banner区域 广告区域展示位置，1为首页（默认值），2为商品分类页
export const getHomeBannerAPI = (distributionSite = 1) => {
  return http<BannerItem[]>({
    method: 'GET',
    url: '/home/banner',
    data: { distributionSite },
  })
}
