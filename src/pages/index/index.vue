<script setup lang="ts">
import CustomNavbar from '@/pages/index/components/CustomNavbar.vue'
import type { BannerItem } from '@/types/home'
import { ref } from 'vue'
import { getHomeBannerAPI } from '@/services/home'
import { onLoad } from '@dcloudio/uni-app'
import CategoryPanel from '@/pages/index/components/CategoryPanel.vue'

const bannerList = ref<BannerItem[]>([])
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  // console.log(res)
  bannerList.value = res.result
}
onLoad(() => {
  getHomeBannerData()
})
</script>

<template>
  <CustomNavbar />
  <XtxSwiper :list="bannerList" />
  <CategoryPanel />
  <view class="index"></view>
</template>

<style lang="scss">
//首页背景颜色
page {
  background-color: #f7f7f7;
}
</style>
