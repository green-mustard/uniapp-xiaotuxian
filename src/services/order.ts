/* 订单相关的API */

import type {
  OrderCreateParams,
  OrderListParams,
  OrderListResult,
  OrderLogisticResult,
  OrderPreResult,
  OrderResult,
} from '@/types/order'
import { http } from '@/utils/http'

// 填写订单-获取预付订单
export const getMemberOrderPreAPI = () => {
  return http<OrderPreResult>({
    method: 'GET',
    url: '/member/order/pre',
  })
}

// 填写订单-获取立即购买订单
export const getMemberOrderPreNowAPI = (data: {
  skuId: string
  count: string
  addressId?: string
}) => {
  return http<OrderPreResult>({
    method: 'GET',
    url: 'member/order/pre/now',
    data,
  })
}

// 提交订单
export const postMemberOrderAPI = (data: OrderCreateParams) => {
  return http<{ id: string }>({
    method: 'POST',
    url: 'member/order',
    data,
  })
}

// 获取订单详情
export const getMemberOrderByIdAPI = (id: string) => {
  return http<OrderResult>({
    method: 'GET',
    url: `member/order/${id}`,
  })
}

//模拟发货
export const getMemberOrderConsigmentByIdAPI = (id: string) => {
  return http({
    method: 'GET',
    url: `/member/order/consignment/${id}`,
  })
}

// 确认收货
export const getMemberOrderReceiptAPI = (id: string) => {
  return http<OrderResult>({
    method: 'PUT',
    url: `/member/order/${id}/receipt`,
  })
}

// 获取订单物流
export const getMemberOrderLogisticsAPI = (id: string) => {
  return http<OrderLogisticResult>({
    method: 'GET',
    url: `/member/order/${id}/logistics`,
  })
}

// 删除订单
export const deleteMemberOrderAPI = (data: { ids: string[] }) => {
  return http({
    method: 'DELETE',
    url: '/member/order',
    data,
  })
}

// 获取订单列表
export const getMemberOrderListAPI = (data: OrderListParams) => {
  return http<OrderListResult>({
    method: 'GET',
    url: '/member/order',
    data,
  })
}
