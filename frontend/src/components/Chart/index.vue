<template>
  <div class="notion-chart-container">
    <div ref="chartRef" :style="{ width: width, height: height }"></div>
    <div v-if="loading" class="chart-loading-overlay">
      <div class="loading-spinner">
        <span class="spinner-ring"></span>
        <span class="loading-text">加载中</span>
      </div>
    </div>
    <div v-if="!loading && isEmpty" class="chart-empty-state">
      <EmptyState :description="emptyText || '暂无图表数据'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from '@/utils/echarts'
import EmptyState from '@/components/common/EmptyState.vue'

interface Props {
  options: echarts.EChartsOption
  width?: string
  height?: string
  loading?: boolean
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '300px',
  loading: false,
  emptyText: ''
})

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

const isEmpty = ref(false)

function initChart() {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption(applyNotionTheme(props.options), true)
    checkDataEmpty(props.options)
    window.addEventListener('resize', resizeChart)
  }
}

/**
 * 应用 Notion 浅色主题到 ECharts 配置
 * 颜色值与 src/styles/_notion-values.scss 对齐
 */
function applyNotionTheme(options: echarts.EChartsOption): echarts.EChartsOption {
  const fontFamily = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'

  return {
    backgroundColor: 'transparent',

    title: {
      ...options.title,
      textStyle: {
        color: '#000000',
        fontFamily,
        fontSize: 20,
        fontWeight: 600,
        ...(options.title as any)?.textStyle || {}
      }
    },

    legend: {
      ...options.legend,
      textStyle: {
        color: '#615d59',
        fontFamily,
        ...(options.legend as any)?.textStyle || {}
      }
    },

    tooltip: {
      ...options.tooltip,
      backgroundColor: '#ffffff',
      borderColor: '#e6e6e6',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: {
        color: '#000000',
        fontFamily,
        fontSize: 14,
        ...(options.tooltip as any)?.textStyle || {}
      },
      extraCssText: 'box-shadow: 0 0.175px 1.041px rgba(0,0,0,0.01), 0 0.8px 2.925px rgba(0,0,0,0.02), 0 2.025px 7.847px rgba(0,0,0,0.027), 0 4px 18px rgba(0,0,0,0.04); border-radius: 8px;'
    },

    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '12%',
      containLabel: true,
      ...options.grid
    },

    xAxis: {
      ...(options.xAxis as any),
      axisLine: { lineStyle: { color: '#e6e6e6' } },
      axisLabel: {
        color: '#615d59',
        fontFamily,
        fontSize: 12,
        ...(options.xAxis as any)?.axisLabel || {}
      },
      splitLine: {
        show: true,
        lineStyle: { color: '#f6f5f4', type: 'solid' }
      }
    } as any,

    yAxis: {
      ...(options.yAxis as any),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#615d59',
        fontFamily,
        fontSize: 12,
        ...(options.yAxis as any)?.axisLabel || {}
      },
      splitLine: {
        lineStyle: { color: '#f6f5f4', type: 'solid' }
      }
    } as any,

    series: (options.series as any[])?.map((series) => {
      if (series.type === 'line') {
        return {
          ...series,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: series.color || '#0075de',
            width: 2.5,
            ...series.lineStyle
          },
          itemStyle: {
            color: series.color || '#0075de',
            borderColor: '#ffffff',
            borderWidth: 2,
            ...series.itemStyle
          },
          areaStyle: series.areaStyle || {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `rgba(0, 117, 222, ${series.areaOpacity || 0.12})` },
              { offset: 1, color: 'rgba(0, 117, 222, 0.02)' }
            ])
          }
        }
      } else if (series.type === 'bar') {
        return {
          ...series,
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: series.color || '#0075de',
            ...series.itemStyle
          }
        }
      } else if (series.type === 'pie') {
        return {
          ...series,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#ffffff',
            borderWidth: 2,
            ...series.itemStyle
          },
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 600,
              fontFamily,
              color: '#000000'
            }
          },
          color: ['#0075de', '#62aef0', '#2a9d99', '#1aae39', '#9a6700', '#cf222e']
        }
      }
      return series
    })
  }
}

function checkDataEmpty(options: echarts.EChartsOption) {
  const series = options.series as any[]
  if (!series || series.length === 0) {
    isEmpty.value = true
    return
  }
  const hasData = series.some(s => {
    if (Array.isArray(s.data)) {
      return s.data.some(d => d !== undefined && d !== null && d !== 0)
    }
    return false
  })
  isEmpty.value = !hasData
}

function resizeChart() {
  chartInstance?.resize()
}

watch(() => props.options, (newOptions) => {
  if (chartInstance) {
    chartInstance.setOption(applyNotionTheme(newOptions), true)
    checkDataEmpty(newOptions)
  }
}, { deep: true })

onMounted(() => { initChart() })
onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
})

defineExpose({ resize: resizeChart })
</script>

<style scoped lang="scss">
.notion-chart-container {
  position: relative;
  width: 100%;

  :deep(> div:first-child) {
    width: 100%;
  }
}

.chart-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(246, 245, 244, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: inherit;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner-ring {
  width: 36px;
  height: 36px;
  border: 2px solid #e6e6e6;
  border-top-color: #0075de;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-family: var(--font-family-base);
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
}

.chart-empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
