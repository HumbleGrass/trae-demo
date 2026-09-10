import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const refreshKey = ref(0)
  const lastBorrowTime = ref<Date | null>(null)

  const triggerRefresh = () => {
    refreshKey.value++
    lastBorrowTime.value = new Date()
  }

  return {
    refreshKey,
    lastBorrowTime,
    triggerRefresh
  }
})
