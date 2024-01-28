<script setup lang="ts">
import type { OrderListParams, OrderItem } from '@/types/order'
import {
  deleteMemberOrderAPI,
  getMemberOrderListAPI,
  getMemberOrderReceiptAPI,
} from '@/services/order'
import { onMounted, ref } from 'vue'
import { OrderState, orderStateList } from '@/services/constants'
import { getPayMockAPI, getWxPayMiniPayAPI } from '@/services/pay'
import { throttle } from 'lodash'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 定义props
const props = defineProps<{
  orderState: number
}>()

// 准备请求参数
const queryParams: OrderListParams = {
  page: 1,
  pageSize: 5,
  orderState: props.orderState,
}

// 定义已结束标记
const finished = ref(false)
// 获取订单列表的数据
const orderList = ref<OrderItem[]>([])
const getMemberOrderListData = async () => {
  // 判断是否已加载所有内容
  if (finished.value) {
    return uni.showToast({ icon: 'none', title: '没有更多内容了~' })
  }
  const res = await getMemberOrderListAPI(queryParams)
  // 数据获取
  orderList.value.push(...res.result.items)
  // 分页条件
  if (queryParams.page! < res.result.pages) {
    // 页码累加
    queryParams.page!++
  } else {
    finished.value = true
  }
}

// 页面滚动触底的回调
const onScrolltolower = throttle(async () => {
  // 获取数据
  getMemberOrderListData()
}, 600)

// 组件挂载时调用
onMounted(() => {
  getMemberOrderListData()
})

// 支付订单的回调
const isDev = import.meta.env.DEV
const onPayOrder = async (id: string) => {
  if (isDev) {
    // 开发环境模拟支付
    getPayMockAPI({ orderId: id })
  } else {
    // 正式环境的微信支付
    const res = await getWxPayMiniPayAPI({ orderId: id })
    // console.log(res)
    wx.requestPayment(res.result)
  }
  // 支付成功的提示
  uni.showToast({ icon: 'success', title: '支付成功~' })
  // 更新订单状态
  const order = orderList.value.find((item) => item.id === id)
  order!.orderState = OrderState.DaiFaHuo
}

// 确认收货的回调
const onReceiptComfirm = (id: string) => {
  // 二次弹窗确认
  uni.showModal({
    content: '为保障您的权益，请收到货并确认无误后，再确认收货',
    success: async (success) => {
      if (success.confirm) {
        await getMemberOrderReceiptAPI(id)
        // 更新订单列表
        const res = await getMemberOrderListAPI(queryParams)
        orderList.value = res.result.items
      }
    },
  })
}

// 删除订单的回调
const onDeleteOrder = (id: string) => {
  // 二次弹窗确认
  uni.showModal({
    content: '确认删除订单吗？',
    success: async (success) => {
      if (success.confirm) {
        deleteMemberOrderAPI({ ids: [id] })
        // 更新订单列表
        const res = await getMemberOrderListAPI(queryParams)
        orderList.value = res.result.items
      }
    },
  })
}

// 下拉刷新的状态
const isTriggered = ref(false)
// 下拉刷新功能待实现
const onRefresherrefresh = async () => {
  // 开始下拉动画
  isTriggered.value = true
  finished.value = false
  // 重置数据
  queryParams.page = 1
  orderList.value = []
  // 重新获取订单列表的数据
  await getMemberOrderListData()
  // 结束下拉动画
  isTriggered.value = false
  finished.value = true
}
</script>

<template>
  <scroll-view
    scroll-y
    class="orders"
    refresher-enabled
    @refresherrefresh="onRefresherrefresh"
    :refresher-triggered="isTriggered"
    @scrolltolower="onScrolltolower"
  >
    <view class="card" v-for="item in orderList" :key="item.id">
      <!-- 订单信息 -->
      <view class="status">
        <text class="date">{{ item.createTime }}</text>
        <!-- 订单状态文字 -->
        <text>{{ orderStateList[item.orderState].text }}</text>
        <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
        <text
          class="icon-delete"
          v-if="item.orderState >= OrderState.DaiPingJia"
          @tap="onDeleteOrder(item.id)"
        ></text>
      </view>
      <!-- 商品信息，点击商品跳转到订单详情，不是商品详情, 所以用外层循环item的id -->
      <navigator
        v-for="sku in item.skus"
        :key="sku.id"
        class="goods"
        :url="`/pagesOrder/detail/detail?id=${item.id}`"
        hover-class="none"
      >
        <view class="cover">
          <image mode="aspectFit" :src="sku.image"> </image>
        </view>
        <view class="meta">
          <view class="name ellipsis">{{ sku.name }}</view>
          <view class="type">{{ sku.attrsText }}</view>
        </view>
      </navigator>
      <!-- 支付信息 -->
      <view class="payment">
        <text class="quantity">共{{ item.totalNum }}件商品</text>
        <text>实付</text>
        <text class="amount"> <text class="symbol">¥</text>{{ item.payMoney }}</text>
      </view>
      <!-- 订单操作按钮 -->
      <view class="action">
        <!-- 待付款状态：显示去支付按钮 -->
        <template v-if="item.orderState === OrderState.DaiFuKuan">
          <view class="button primary" @tap="onPayOrder(item.id)">去支付</view>
        </template>
        <template v-else>
          <navigator
            class="button secondary"
            :url="`/pagesOrder/create/create?orderId=id`"
            hover-class="none"
          >
            再次购买
          </navigator>
          <!-- 待收货状态: 展示确认收货 -->
          <view
            v-if="item.orderState === OrderState.DaiShouHuo"
            class="button primary"
            @tap="onReceiptComfirm(item.id)"
          >
            确认收货
          </view>
          <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
          <view
            class="button delete"
            v-if="item.orderState >= OrderState.DaiPingJia"
            @tap="onDeleteOrder(item.id)"
          >
            删除订单
          </view>
        </template>
      </view>
    </view>
    <!-- 底部提示文字 -->
    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      {{ finished ? '没有更多数据~' : '正在加载...' }}
    </view>
  </scroll-view>
</template>

<style lang="scss">
// 订单列表
.orders {
  .card {
    min-height: 100rpx;
    padding: 20rpx;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #fff;

    &:last-child {
      padding-bottom: 40rpx;
    }
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #999;
    margin-bottom: 15rpx;

    .date {
      color: #666;
      flex: 1;
    }

    .primary {
      color: #ff9240;
    }

    .icon-delete {
      line-height: 1;
      margin-left: 10rpx;
      padding-left: 10rpx;
      border-left: 1rpx solid #e3e3e3;
    }
  }

  .goods {
    display: flex;
    margin-bottom: 20rpx;

    .cover {
      width: 170rpx;
      height: 170rpx;
      margin-right: 20rpx;
      border-radius: 10rpx;
      overflow: hidden;
      position: relative;
    }

    .quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      line-height: 1;
      padding: 6rpx 4rpx 6rpx 8rpx;
      font-size: 24rpx;
      color: #fff;
      border-radius: 10rpx 0 0 0;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .type {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 10rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .more {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #333;
    }
  }

  .payment {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    line-height: 1;
    padding: 20rpx 0;
    text-align: right;
    color: #999;
    font-size: 28rpx;
    border-bottom: 1rpx solid #eee;

    .quantity {
      font-size: 24rpx;
      margin-right: 16rpx;
    }

    .amount {
      color: #444;
      margin-left: 6rpx;
    }

    .symbol {
      font-size: 20rpx;
    }
  }

  .action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 20rpx;

    .button {
      width: 180rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20rpx;
      border-radius: 60rpx;
      border: 1rpx solid #ccc;
      font-size: 26rpx;
      color: #444;
    }

    .secondary {
      color: #27ba9b;
      border-color: #27ba9b;
    }

    .primary {
      color: #fff;
      background-color: #27ba9b;
    }
  }

  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
</style>
