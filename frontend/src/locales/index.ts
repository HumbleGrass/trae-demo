import { createI18n } from 'vue-i18n'
import zhCn from './zh-CN'
import en from './en'

/**
 * 国际化配置
 * @description 配置 vue-i18n，支持中英文切换
 */
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCn,
    'en-US': en
  }
})

export default i18n