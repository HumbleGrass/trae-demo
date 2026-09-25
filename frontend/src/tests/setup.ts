/**
 * Vitest 全局测试环境配置
 * @description 在每个测试文件运行前统一安装 Element Plus / Pinia / Vue I18n，
 * 并补齐 happy-dom 缺失的浏览器 API（matchMedia / ResizeObserver 等），
 * 避免各组件测试重复搭建环境，同时保证被测组件内 useI18n() 可用。
 */
import { config } from '@vue/test-utils'
import { afterEach, beforeEach } from 'vitest'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import zhCn from '@/locales/zh-CN'

// happy-dom 未实现 matchMedia，Element Plus 响应式组件会依赖它，此处提供最小实现
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false
    } as unknown as MediaQueryList
  }
}

// happy-dom 未实现 ResizeObserver，ECharts / Element Plus 部分组件需要它
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

// 测试环境下无需真实滚动，兜底 Element Plus 表格 / 分页组件调用
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => undefined
}

// Element Plus 弹窗默认包在 <transition> 中，测试里直接同步渲染便于断言
config.global.stubs.transition = false
config.global.stubs['transition-group'] = false

// 与 main.ts 保持一致：按需引入后 v-loading 等指令由 ElementPlus 插件注册
config.global.plugins.push(ElementPlus)
config.global.plugins.push(createPinia())

// 被测页面组件在 setup 中调用 useI18n()，测试环境统一挂载与生产一致的 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: { 'zh-CN': zhCn }
})
config.global.plugins.push(i18n)

// 用例之间隔离 localStorage 状态（登录页「记住用户名」等逻辑依赖它）
beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  document.body.innerHTML = ''
})
