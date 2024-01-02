import type { XtxGuessInstance } from '@/types/component'
import { ref } from 'vue'

// 猜你喜欢的组合式函数
export const useGuessList = () => {
  // 获取猜你喜欢的组件实例
  const guessRef = ref<XtxGuessInstance>()

  // 滚动触底事件的处理回调函数
  const onScrolltolower = () => {
    // console.log('滚动触底~')
    guessRef.value?.getMore()
  }

  // 返回 ref和事件处理函数
  return { guessRef, onScrolltolower }
}
