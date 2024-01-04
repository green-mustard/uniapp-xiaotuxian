import type { ProfileDetail, ProfileParams } from '@/types/members'
import { http } from '@/utils/http'

// 获取个人信息的API
export const getMemberProfileAPI = () => {
  return http<ProfileDetail>({
    method: 'GET',
    url: '/member/profile',
  })
}

// 修改个人信息的API
export const changeMemberProfileAPI = (data: ProfileParams) => {
  return http({
    method: 'PUT',
    url: '/member/profile',
    data,
  })
}
