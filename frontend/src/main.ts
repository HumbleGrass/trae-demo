import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MonitoringSDK } from '@monitoring/sdk-js'
import { createVueIntegration } from '@monitoring/sdk-js-vue'
import App from './App.vue'
import router from './router'
import i18n from './locales'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './styles/element-overrides.scss'
import './styles/design-tokens.scss'
import './styles/index.scss'
import './styles/element-adjustments.scss'

const sdk = MonitoringSDK.init({
  projectId: import.meta.env.VITE_MONITOR_PROJECT_ID || '',
  apiUrl: import.meta.env.VITE_MONITOR_API_URL || 'http://localhost:3000',
  captureErrors: true,                    // 捕获 JS 错误 & 未处理的 Promise 拒绝
  captureApiLogs: true,                   // 拦截 fetch/XHR 请求，记录 API 日志
  sessionReplay: true,                    // 开启会话回放（DOM 事件录制）
  sampleRate: 1,                          // 采样率：1 = 100% 采集，0.1 = 10%
  traceEnabled: true,                     // 在 API 请求中注入 X-Trace-Id 链路追踪头
  ignoreErrors: [                         // 忽略特定错误
    'ResizeObserver loop limit exceeded', // 常见的浏览器无害警告
    /Network Error/i,                     // 忽略网络错误（正则匹配）
  ],
})

const app = createApp(App)
const pinia = createPinia()

createVueIntegration(sdk, { app })

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(ElementPlus, {
  size: 'default',
  zIndex: 3000,
  // 全局配置按钮主题
  button: {
    autoInsertSpace: false
  },
  // 全局配置表单主题
  form: {
    labelPosition: 'right',
    size: 'default'
  },
  // 全局配置消息提示时长
  message: {
    duration: 3000
  }
})

app.mount('#app')
