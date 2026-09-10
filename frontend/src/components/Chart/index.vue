<template>
  <div class="tech-chart-container">
    <div ref="chartRef" :style="{ width: width, height: height }"></div>
    <div v-if="loading" class="chart-loading-overlay">
      <div class="loading-spinner">
        <span class="spinner-ring"></span>
        <span class="loading-text">LOADING DATA</span>
      </div>
    </div>
    <div v-if="!loading && isEmpty" class="chart-empty-state">
      <EmptyState :description="emptyText || '暂无图表数据'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
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
    
    // 应用科技风格配置
    const techOptions = applyTechTheme(props.options)
    chartInstance.setOption(techOptions, true)
    
    // 检查是否有数据
    checkDataEmpty(props.options)
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', resizeChart)
  }
}

/**
 * 应用科技风格主题到 ECharts 配置
 */
function applyTechTheme(options: echarts.EChartsOption): echarts.EChartsOption {
  return {
    backgroundColor: 'transparent',
    
    // 标题样式
    title: {
      ...options.title,
      textStyle: {
        color: '#e0e0ff',
        fontFamily: 'Inter, sans-serif',
        fontSize: (options.title as any)?.textSize || 16,
        fontWeight: 700,
        textShadowColor: '#00f3ff',
        textShadowBlur: 10,
        ...(options.title as any)?.textStyle || {}
      }
    },
    
    // 图例样式
    legend: {
      ...options.legend,
      textStyle: {
        color: '#b0b0d0',
        fontFamily: 'Inter, sans-serif',
        ...(options.legend as any)?.textStyle || {}
      }
    },
    
    // 提示框 - 玻璃态科技风格
    tooltip: {
      ...options.tooltip,
      backgroundColor: 'rgba(20, 20, 40, 0.95)',
      borderColor: 'rgba(0, 243, 255, 0.3)',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: {
        color: '#e0e0ff',
        fontFamily: 'Inter, sans-serif',
        fontSize: 13,
        ...(options.tooltip as any)?.textStyle || {}
      },
      extraCssText: 'box-shadow: 0 4px 20px rgba(0, 243, 255, 0.2); backdrop-filter: blur(10px); border-radius: 4px;'
    },
    
    // 网格
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '12%',
      containLabel: true,
      ...options.grid
    },
    
    // X轴
    xAxis: {
      ...options.xAxis as any,
      axisLine: {
        lineStyle: { 
          color: 'rgba(0, 243, 255, 0.2)' 
        }
      },
      axisLabel: {
        color: '#8080a0',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12,
        ...(options.xAxis as any)?.axisLabel || {}
      },
      splitLine: {
        show: true,
        lineStyle: { 
          color: 'rgba(0, 243, 255, 0.05)',
          type: 'dashed' as const
        }
      }
    } as any,
    
    // Y轴
    yAxis: {
      ...options.yAxis as any,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#8080a0',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12,
        ...(options.yAxis as any)?.axisLabel || {}
      },
      splitLine: {
        lineStyle: { 
          color: 'rgba(0, 243, 255, 0.1)',
          type: 'dashed' as const
        }
      }
    } as any,
    
    // 系列 - 自动应用霓虹发光效果
    series: (options.series as any[])?.map((series) => {
      if (series.type === 'line') {
        return {
          ...series,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            color: series.color || '#00f3ff',
            width: 2.5,
            shadowColor: series.color || '#00f3ff',
            shadowBlur: 10,
            ...series.lineStyle
          },
          itemStyle: {
            color: series.color || '#00f3ff',
            borderColor: '#fff',
            borderWidth: 2,
            ...series.itemStyle
          },
          areaStyle: series.areaStyle || {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `rgba(0, 243, 255, ${series.areaOpacity || 0.15})` },
              { offset: 1, color: `rgba(0, 243, 255, 0.02)` }
            ])
          }
        }
      } else if (series.type === 'bar') {
        return {
          ...series,
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#33e0ff' },
              { offset: 1, color: '#00c8d4' }
            ]),
            shadowColor: 'rgba(0, 243, 255, 0.4)',
            shadowBlur: 12,
            ...series.itemStyle
          }
        }
      } else if (series.type === 'pie') {
        return {
          ...series,
          radius: ['45%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#0a0a1a',
            borderWidth: 2,
            ...series.itemStyle
          },
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
              fontFamily: 'Inter, sans-serif',
              color: '#00f3ff'
            }
          },
          color: ['#00f3ff', '#ff00ff', '#00ff88', '#ffaa00', '#ff3366']
        }
      }
      return series
    })
  }
}

/**
 * 检查数据是否为空
 */
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
    const techOptions = applyTechTheme(newOptions)
    chartInstance.setOption(techOptions, true)
    checkDataEmpty(newOptions)
  }
}, { deep: true })

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
})

defineExpose({
  resize: resizeChart
})
</script>

<style scoped lang="scss">
.tech-chart-container {
  position: relative;
  width: 100%;
  
  > div:first-child {
    width: 100% !important;
  }
}

.chart-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 26, 0.9);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner-ring {
  width: 48px;
  height: 48px;
  border: 3px solid var(--tech-border-color);
  border-top-color: var(--tech-neon-cyan);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-family: var(--tech-font-mono);
  font-size: 13px;
  color: var(--tech-neon-cyan);
  letter-spacing: 0.1em;
  animation: pulse-text 1.5s ease-in-out infinite;
}

@keyframes pulse-text {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.chart-empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
