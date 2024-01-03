import type { ProfileDetail } from '@/types/members'
import { http } from '@/utils/http'

// 获取个人信息的API
export const getMemberProfileAPI = () => {
  return http<ProfileDetail>({
    method: 'GET',
    url: '/member/profile',
  })
}
