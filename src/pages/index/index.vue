<script setup lang="ts">
import CustomNavbar from '@/pages/index/components/CustomNavbar.vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import { ref } from 'vue'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import { onLoad } from '@dcloudio/uni-app'
import CategoryPanel from '@/pages/index/components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'

// 获取banner数据
const bannerList = ref<BannerItem[]>([])
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  // console.log(res)
  bannerList.value = res.result
}
onLoad(() => {
  getHomeBannerData()
  getHomeCategoryData()
  getHomeHotData()
})

// 获取前台分类数据
const categoryList = ref<CategoryItem[]>([])
const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  // console.log(res)
  categoryList.value = res.result
}

// 获取热门推荐数据
const hotData = ref<HotItem[]>([])
const getHomeHotData = async () => {
  const res = await getHomeHotAPI()
  // console.log(res)
  hotData.value = res.result
}
</script>

<template>
  <!-- 自定义导航栏 -->
  <CustomNavbar />
  <scroll-view scroll-y>
    <!-- 自定义轮播图 -->
    <XtxSwiper :bannerList="bannerList" />
    <!-- 分类面板 -->
    <CategoryPanel :categoryList="categoryList" />
    <!-- 热门推荐 -->
    <HotPanel :data="hotData" />
    <!-- 猜你喜欢 -->
    <XtxGuess />
  </scroll-view>
</template>

<style lang="scss">
//首页背景颜色
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
