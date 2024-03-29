// src/pages/goodsDetail/goodsDetail.vue
<script setup lang="ts">
import { getGoodsByIdAPI } from '@/services/goodsDetail'
import { addCartAPI } from '@/services/cart'
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import type { GoodsResult } from '@/types/goods'
import ServicePanel from '@/pages/goodsDetail/components/servicePanel.vue'
import AddressPanel from '@/pages//goodsDetail//components/addressPanel.vue'
import type {
  SkuPopupEvent,
  SkuPopupInstance,
  SkuPopupLocaldata,
} from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup'
import type { AddressItem } from '@/types/address'
import { getAddressListAPI } from '@/services/address'
import { useAddressStore } from '@/stores/modules/address'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 接收页面参数
const query = defineProps<{
  id: string
}>()
// console.log(query)

// 获取商品详情信息
const goods = ref<GoodsResult>()
const getGoodsDetailData = async () => {
  const res = await getGoodsByIdAPI(query.id)
  // console.log(res)
  goods.value = res.result

  // SKU组件所需格式的数据
  localdata.value = {
    _id: res.result.id,
    name: res.result.name,
    goods_thumb: res.result.mainPictures[0],
    spec_list: res.result.specs.map((item) => {
      return {
        name: item.name,
        list: item.values,
      }
    }),
    sku_list: res.result.skus.map((item) => {
      return {
        _id: item.id,
        goods_id: res.result.id,
        goods_name: res.result.name,
        image: item.picture,
        price: item.price * 100,
        stock: item.inventory,
        sku_name_arr: item.specs.map((item) => item.valueName),
      }
    }),
  }
}

// 获取收货地址列表数据的回调
const addressList = ref<AddressItem[]>()
const getAddressListData = async () => {
  const res = await getAddressListAPI()
  // console.log(res)
  addressList.value = res.result
}

const addressStore = useAddressStore()
// 计算收货地址
const selecteAddress = computed(() => {
  return addressStore.selecteAddress
})

onLoad(() => {
  getGoodsDetailData()
  getAddressListData()
})

// 轮播图变化时的回调
const currIndex = ref(0)
const onChange: UniHelper.SwiperOnChange = (event) => {
  // console.log(event.detail)
  currIndex.value = event.detail!.current
}

// 点击图片时的回调
const onTapImage = (url: string) => {
  // 大图预览
  uni.previewImage({
    current: url,
    urls: goods.value!.mainPictures,
  })
}

// uni-ui 弹出层的组件ref
const popup = ref<{
  open: (type?: UniHelper.UniPopupType) => void
  close: () => void
}>()

// 控制弹出层的条件渲染
const popupFlag = ref<'service' | 'addresse'>()
const openPopup = (flag: typeof popupFlag.value) => {
  // 修改弹出层标记
  popupFlag.value = flag
  // 打开弹出层
  popup.value?.open()
}

// 是否显示SKU组件
const isShow = ref(false)
// 商品信息
const localdata = ref({} as SkuPopupLocaldata)

// 定义按钮的模式
enum SkuMode {
  Both = 1,
  Cart = 2,
  Buy = 3,
}
const mode = ref<SkuMode>(SkuMode.Both)

// 打开Sku弹窗时修改按钮模式的回调
const openSkuPopup = (val: SkuMode) => {
  // 显示Sku弹窗
  isShow.value = true
  // 修改按钮模式
  mode.value = val
}
// 定义skuPopup的组件实例
const skuPopupRef = ref<SkuPopupInstance>()
// 计算被选中的值
const selectedArrText = computed(() => {
  return skuPopupRef.value?.selectArr?.join(' ').trim() || '请选择商品规格'
})

// 加入购物车的回调
const onAddCart = async (event: SkuPopupEvent) => {
  // 调用API
  await addCartAPI({ skuId: event._id, count: event.buy_num })
  uni.showToast({ icon: 'success', title: '成功加入购物车' })
  isShow.value = false
}

// 立即购买事件的回调
const onBueNow = (event: SkuPopupEvent) => {
  uni.navigateTo({ url: `/pagesOrder/create/create?skuId=${event._id}&count=${event.buy_num}` })
}
</script>

<template>
  <!-- SKU弹窗组件 -->
  <vk-data-goods-sku-popup
    v-model="isShow"
    ref="skuPopupRef"
    :localdata="localdata"
    :mode="mode"
    add-cart-background-color="#ffa868"
    buy-now-background-color="#27ba9b"
    :actived-style="{
      color: '#27ba9b',
      borderColor: '#27ba9b',
      backgroundColor: '#e9f8f5',
    }"
    @add-cart="onAddCart"
    @buy-now="onBueNow"
  />
  <scroll-view scroll-y class="viewport">
    <!-- 基本信息 -->
    <view class="goods">
      <!-- 商品主图 -->
      <view class="preview">
        <swiper circular @change="onChange">
          <swiper-item v-for="item in goods?.mainPictures" :key="item">
            <image mode="aspectFill" :src="item" @tap="onTapImage(item)" />
          </swiper-item>
        </swiper>
        <view class="indicator">
          <text class="current">{{ currIndex + 1 }}</text>
          <text class="split">/</text>
          <text class="total">{{ goods?.mainPictures.length }}</text>
        </view>
      </view>

      <!-- 商品简介 -->
      <view class="meta">
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{ goods?.price }}</text>
        </view>
        <view class="name ellipsis">{{ goods?.name }} </view>
        <view class="desc"> {{ goods?.desc }} </view>
      </view>

      <!-- 操作面板 -->
      <view class="action">
        <view class="item arrow" @tap="openSkuPopup(SkuMode.Both)">
          <text class="label">选择</text>
          <text class="text ellipsis"> {{ selectedArrText }} </text>
        </view>
        <view class="item arrow" @tap="openPopup('addresse')">
          <text class="label">送至</text>
          <text class="text" v-if="selecteAddress">
            {{ selecteAddress.fullLocation }}{{ selecteAddress.address }}
          </text>
          <text class="text ellipsis" v-else> 请选择收获地址 </text>
        </view>
        <view class="item arrow" @tap="openPopup('service')">
          <text class="label">服务</text>
          <text class="text ellipsis"> 无忧退 快速退款 免费包邮 </text>
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail panel">
      <view class="title">
        <text>详情</text>
      </view>
      <view class="content">
        <view class="properties">
          <!-- 属性详情 -->
          <view class="item" v-for="item in goods?.details.properties" :key="item.name">
            <text class="label">{{ item.name }}</text>
            <text class="value">{{ item.value }}</text>
          </view>
        </view>
        <!-- 图片详情 -->
        <image
          mode="widthFix"
          v-for="item in goods?.details.pictures"
          :key="item"
          :src="item"
        ></image>
      </view>
    </view>

    <!-- 同类推荐 -->
    <view class="similar panel">
      <view class="title">
        <text>同类推荐</text>
      </view>
      <view class="content">
        <navigator
          v-for="item in goods?.similarProducts"
          :key="item.id"
          class="goods"
          hover-class="none"
          :url="`/pages/goodsdetail/goodsdetail?id=${item.id}`"
        >
          <image class="image" mode="aspectFill" :src="item.picture"></image>
          <view class="name ellipsis">{{ item.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ item.price }}</text>
          </view>
        </navigator>
      </view>
    </view>
  </scroll-view>

  <!-- 用户操作 -->
  <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="icons">
      <button class="icons-button"><text class="icon-heart"></text>收藏</button>
      <button class="icons-button" open-type="contact">
        <text class="icon-handset"></text>客服
      </button>
      <navigator class="icons-button" url="/pages/cart/cartcopy" open-type="navigate">
        <text class="icon-cart"></text>购物车
      </navigator>
    </view>
    <view class="buttons">
      <view class="addcart" @tap="openSkuPopup(SkuMode.Cart)"> 加入购物车 </view>
      <view class="buynow" @tap="openSkuPopup(SkuMode.Buy)"> 立即购买 </view>
    </view>
  </view>

  <!-- Uni-ui 弹出层 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <AddressPanel
      v-if="popupFlag === 'addresse'"
      @close="popup?.close()"
      :addressList="(addressList as AddressItem[])"
    />
    <ServicePanel v-if="popupFlag === 'service'" @close="popup?.close()" />
  </uni-popup>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.viewport {
  background-color: #f4f4f4;
}

.panel {
  margin-top: 20rpx;
  background-color: #fff;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    line-height: 1;
    padding: 30rpx 60rpx 30rpx 6rpx;
    position: relative;

    text {
      padding-left: 10rpx;
      font-size: 28rpx;
      color: #333;
      font-weight: 600;
      border-left: 4rpx solid #27ba9b;
    }

    navigator {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.arrow {
  &::after {
    position: absolute;
    top: 50%;
    right: 30rpx;
    content: '\e6c2';
    color: #ccc;
    font-family: 'erabbit' !important;
    font-size: 32rpx;
    transform: translateY(-50%);
  }
}

/* 商品信息 */
.goods {
  background-color: #fff;

  .preview {
    height: 750rpx;
    position: relative;

    .image {
      width: 750rpx;
      height: 750rpx;
    }

    .indicator {
      height: 40rpx;
      padding: 0 24rpx;
      line-height: 40rpx;
      border-radius: 30rpx;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 30rpx;
      right: 30rpx;

      .current {
        font-size: 26rpx;
      }

      .split {
        font-size: 24rpx;
        margin: 0 1rpx 0 2rpx;
      }

      .total {
        font-size: 24rpx;
      }
    }
  }

  .meta {
    position: relative;
    border-bottom: 1rpx solid #eaeaea;

    .price {
      height: 130rpx;
      padding: 25rpx 30rpx 0;
      color: #fff;
      font-size: 34rpx;
      box-sizing: border-box;
      background-color: #35c8a9;
    }

    .number {
      font-size: 56rpx;
    }

    .brand {
      width: 160rpx;
      height: 80rpx;
      overflow: hidden;
      position: absolute;
      top: 26rpx;
      right: 30rpx;
    }

    .name {
      max-height: 88rpx;
      line-height: 1.4;
      margin: 20rpx;
      font-size: 32rpx;
      color: #333;
    }

    .desc {
      line-height: 1;
      padding: 0 20rpx 30rpx;
      font-size: 24rpx;
      color: #cf4444;
    }
  }

  .action {
    padding-left: 20rpx;

    .item {
      height: 90rpx;
      padding-right: 60rpx;
      border-bottom: 1rpx solid #eaeaea;
      font-size: 26rpx;
      color: #333;
      position: relative;
      display: flex;
      align-items: center;

      &:last-child {
        border-bottom: 0 none;
      }
    }

    .label {
      width: 60rpx;
      color: #898b94;
      margin: 0 16rpx 0 10rpx;
    }

    .text {
      flex: 1;
      -webkit-line-clamp: 1;
    }
  }
}

/* 商品详情 */
.detail {
  padding-left: 20rpx;

  .content {
    margin-left: -20rpx;

    .image {
      width: 100%;
    }
  }

  .properties {
    padding: 0 20rpx;
    margin-bottom: 30rpx;

    .item {
      display: flex;
      line-height: 2;
      padding: 10rpx;
      font-size: 26rpx;
      color: #333;
      border-bottom: 1rpx dashed #ccc;
    }

    .label {
      width: 200rpx;
    }

    .value {
      flex: 1;
    }
  }
}

/* 同类推荐 */
.similar {
  .content {
    padding: 0 20rpx 200rpx;
    background-color: #f4f4f4;
    display: flex;
    flex-wrap: wrap;

    .goods {
      width: 340rpx;
      padding: 24rpx 20rpx 20rpx;
      margin: 20rpx 7rpx;
      border-radius: 10rpx;
      background-color: #fff;
    }

    .image {
      width: 300rpx;
      height: 260rpx;
    }

    .name {
      height: 80rpx;
      margin: 10rpx 0;
      font-size: 26rpx;
      color: #262626;
    }

    .price {
      line-height: 1;
      font-size: 20rpx;
      color: #cf4444;
    }

    .number {
      font-size: 26rpx;
      margin-left: 2rpx;
    }
  }

  navigator {
    &:nth-child(even) {
      margin-right: 0;
    }
  }
}

/* 底部工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx var(--window-bottom);
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;

  .buttons {
    display: flex;

    & > view {
      width: 220rpx;
      text-align: center;
      line-height: 72rpx;
      font-size: 26rpx;
      color: #fff;
      border-radius: 72rpx;
    }

    .addcart {
      background-color: #ffa868;
    }

    .buynow,
    .payment {
      background-color: #27ba9b;
      margin-left: 20rpx;
    }
  }

  .icons {
    padding-right: 10rpx;
    display: flex;
    align-items: center;
    flex: 1;

    .icons-button {
      flex: 1;
      text-align: center;
      line-height: 1.4;
      padding: 0;
      margin: 0;
      border-radius: 0;
      font-size: 20rpx;
      color: #333;
      background-color: #fff;

      &::after {
        border: none;
      }
    }

    text {
      display: block;
      font-size: 34rpx;
    }
  }
}
</style>
