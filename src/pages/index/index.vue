<script setup lang="ts">
import CustomNavbar from '@/pages/index/components/CustomNavbar.vue'
import type { BannerItem, CategoryItem } from '@/types/home'
import { ref } from 'vue'
import { getHomeBannerAPI, getHomeCategoryAPI } from '@/services/home'
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
  getHomeCategoryData()
})

// 获取前台分类数据
const categoryList = ref<CategoryItem[]>([])
const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  // console.log(res)
  categoryList.value = res.result
}
</script>

<template>
  <CustomNavbar />
  <XtxSwiper :bannerList="bannerList" />
  <CategoryPanel :categoryList="categoryList" />
  <view class="index"></view>
</template>

<style lang="scss">
//首页背景颜色
page {
  background-color: #f7f7f7;
}
</style>
