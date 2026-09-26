import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    // Element Plus 按需引入：模板中使用的 el-* 组件在编译期自动注入组件与
    // SCSS 样式（样式源码经 element-theme.scss 定制的主题变量编译）
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass', directives: false })],
      dts: false,
    }),
    // 构建时同步产出 .gz 预压缩文件，需 Web 服务器开启 gzip_static 类支持
    viteCompression({ algorithm: 'gzip', ext: '.gz', threshold: 10240 }),
    // 构建产物分析：npm run build -- --mode analyze，结果输出到 dist/stats.html
    ...(mode === 'analyze'
      ? [visualizer({ filename: 'dist/stats.html', gzipSize: true, open: false })]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 将 Notion 主题变量注入每个 SCSS 编译单元（含按需引入的 Element Plus
        // 组件样式），使 theme-chalk 在编译期读取自定义变量，替代全量样式编译
        additionalData: '@use "@/styles/element-theme.scss" as ep-theme;\n',
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // 第三方依赖拆分：Element Plus / ECharts 体积大且被多页面共享，
        // 独立成稳定命名的 chunk，业务代码变更不影响其缓存
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/[\\/]echarts[\\/]/.test(id)) return 'echarts'
          if (/[\\/]element-plus[\\/]|[\\/]@element-plus[\\/]/.test(id)) return 'element-plus'
          if (/[\\/](vue|@vue|vue-router|pinia|vue-i18n|@intlify)[\\/]/.test(id)) return 'vue-vendor'
          return undefined
        },
      },
    },
  },
}))
