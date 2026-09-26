<template>
  <el-config-provider
    :locale="currentLocale"
    size="default"
    :z-index="3000"
    :button="{ autoInsertSpace: false }"
    :message="{ duration: 3000 }"
  >
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

const { locale } = useI18n()

const currentLocale = computed(() => {
  return locale.value === 'zh-CN' ? zhCn : en
})

</script>
