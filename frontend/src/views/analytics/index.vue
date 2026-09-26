<template>
  <TechPageLayout title="数据分析" subtitle="深度数据洞察与趋势分析">
    <div class="analytics-content fade-in-up" v-loading="loading">
      <!-- 图表网格 -->
      <div class="charts-grid fade-in-up delay-1">
        <!-- 借阅趋势 -->
        <TechCard class="chart-card">
          <template #header>
            <h3 class="chart-title">借阅趋势</h3>
          </template>
          <Chart 
            :options="borrowTrendOptions" 
            height="320px"
            :loading="loading"
          />
        </TechCard>

        <!-- 图书分类占比 -->
        <TechCard class="chart-card">
          <template #header>
            <h3 class="chart-title">分类占比</h3>
          </template>
          <Chart 
            :options="categoryPieOptions" 
            height="320px"
            :loading="loading"
          />
        </TechCard>
      </div>

      <!-- 第二行图表 -->
      <div class="charts-grid fade-in-up delay-2">
        <!-- 会员活跃度 -->
        <TechCard class="chart-card">
          <template #header>
            <h3 class="chart-title">会员活跃度</h3>
          </template>
          <Chart 
            :options="memberActivityOptions" 
            height="320px"
            :loading="loading"
          />
        </TechCard>

        <!-- 借阅时长分布 -->
        <TechCard class="chart-card">
          <template #header>
            <h3 class="chart-title">借阅时长分布</h3>
          </template>
          <Chart 
            :options="durationDistributionOptions" 
            height="320px"
            :loading="loading"
          />
        </TechCard>
      </div>

      <!-- 数据洞察卡片 -->
      <div class="insights-section fade-in-up delay-3">
        <TechCard class="insights-card">
          <template #header>
            <h3 class="chart-title">关键数据洞察</h3>
          </template>
          
          <div class="insights-grid">
            <div class="insight-item">
              <div class="insight-icon trend-up">
                <el-icon :size="20"><TrendCharts /></el-icon>
              </div>
              <div class="insight-content">
                <div class="insight-label code-text">借阅增长率</div>
                <div class="insight-value positive">+23.5%</div>
                <div class="insight-desc">相比上月增长显著</div>
              </div>
            </div>

            <div class="insight-item">
              <div class="insight-icon hot-book">
                <el-icon :size="20"><Notebook /></el-icon>
              </div>
              <div class="insight-content">
                <div class="insight-label code-text">热门类别</div>
                <div class="insight-value">文学小说</div>
                <div class="insight-desc">占总借阅量 35%</div>
              </div>
            </div>

            <div class="insight-item">
              <div class="insight-icon active-users">
                <el-icon :size="20"><User /></el-icon>
              </div>
              <div class="insight-content">
                <div class="insight-label code-text">活跃用户</div>
                <div class="insight-value">1,284 人</div>
                <div class="insight-desc">本月活跃度提升 15%</div>
              </div>
            </div>

            <div class="insight-item">
              <div class="insight-icon avg-duration">
                <el-icon :size="20"><Timer /></el-icon>
              </div>
              <div class="insight-content">
                <div class="insight-label code-text">平均借阅周期</div>
                <div class="insight-value">14.2 天</div>
                <div class="insight-desc">较上月缩短 2.3 天</div>
              </div>
            </div>
          </div>
        </TechCard>
      </div>
    </div>
  </TechPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TrendCharts, Notebook, User, Timer } from '@element-plus/icons-vue'
import Chart from '@/components/Chart/index.vue'
import TechPageLayout from '@/components/layout/TechPageLayout.vue'
import TechCard from '@/components/common/TechCard.vue'

const loading = ref(false)

// 借阅趋势图 - 科技风格
const borrowTrendOptions = ref<any>({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 20, 40, 0.95)',
    borderColor: 'rgba(0, 243, 255, 0.3)',
    textStyle: { color: '#e0e0ff' }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: { lineStyle: { color: 'rgba(0, 117, 222, 0.2)' } },
    axisLabel: { color: '#8080a0', fontFamily: 'JetBrains Mono, monospace' }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#8080a0', fontFamily: 'JetBrains Mono, monospace' },
    splitLine: { lineStyle: { color: 'rgba(0, 117, 222, 0.1)', type: 'dashed' as const } }
  },
  series: [{
    name: '借阅量',
    data: [150, 230, 224, 218, 135, 147, 260],
    type: 'line',
    smooth: true,
    lineStyle: {
      color: '#0075de',
      width: 3
    },
    itemStyle: {
      color: '#0075de',
      borderColor: '#fff',
      borderWidth: 2
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(0, 117, 222, 0.12)' },
          { offset: 1, color: 'rgba(0, 117, 222, 0.02)' }
        ]
      }
    }
  }]
})

// 分类饼图 - 科技风格
const categoryPieOptions = ref<any>({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
    backgroundColor: 'rgba(20, 20, 40, 0.95)',
    borderColor: 'rgba(0, 117, 222, 0.3)'
  },
  legend: {
    orient: 'vertical',
    right: 20,
    top: 'center',
    textStyle: { color: '#b0b0d0', fontFamily: 'Inter, sans-serif' }
  },
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    center: ['40%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: {
      borderRadius: 6,
      borderColor: '#0a0a1a',
      borderWidth: 2
    },
    label: { show: false },
    emphasis: {
      label: {
        show: true,
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Inter, sans-serif',
        color: '#0075de'
      }
    },
    data: [
      { value: 735, name: '文学小说' },
      { value: 580, name: '科学技术' },
      { value: 484, name: '历史传记' },
      { value: 300, name: '经济管理' },
      { value: 200, name: '艺术设计' }
    ],
    color: ['#0075de', '#62aef0', '#2a9d99', '#1aae39', '#9a6700', '#cf222e']
  }]
})

// 会员活跃度 - 科技风格柱状图
const memberActivityOptions = ref<any>({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 20, 40, 0.95)',
    borderColor: 'rgba(0, 117, 222, 0.3)'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['新用户', '轻度活跃', '中度活跃', '高度活跃', '核心用户'],
    axisLine: { lineStyle: { color: 'rgba(0, 117, 222, 0.2)' } },
    axisLabel: { color: '#8080a0', fontFamily: 'JetBrains Mono, monospace' }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#8080a0', fontFamily: 'JetBrains Mono, monospace' },
    splitLine: { lineStyle: { color: 'rgba(0, 117, 222, 0.1)', type: 'dashed' as const } }
  },
  series: [{
    name: '人数',
    data: [320, 450, 380, 200, 134],
    type: 'bar',
    barWidth: '50%',
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#62aef0' },
          { offset: 1, color: '#0075de' }
        ]
      }
    }
  }]
})

// 借阅时长分布 - 科技风格
const durationDistributionOptions = ref<any>({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 20, 40, 0.95)',
    borderColor: 'rgba(0, 117, 222, 0.3)'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['1-5天', '6-10天', '11-15天', '16-20天', '21-25天', '26-30天', '>30天'],
    axisLine: { lineStyle: { color: 'rgba(0, 117, 222, 0.2)' } },
    axisLabel: { color: '#8080a0', fontFamily: 'JetBrains Mono, monospace' }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#8080a0', fontFamily: 'JetBrains Mono, monospace' },
    splitLine: { lineStyle: { color: 'rgba(0, 117, 222, 0.1)', type: 'dashed' as const } }
  },
  series: [{
    name: '数量',
    data: [120, 280, 350, 220, 150, 90, 50],
    type: 'bar',
    barWidth: '55%',
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#391c57' },
          { offset: 1, color: '#0075de' }
        ]
      }
    }
  }]
})

onMounted(() => {
  
})
</script>

<style lang="scss" scoped>
.analytics-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
}

.chart-card {
  .chart-title {
    margin: 0;
    font-family: var(--font-family-base);
    font-size: var(--font-size-title);
    font-weight: var(--font-weight-heading);
    color: var(--text-primary);
  }
}

.insights-section {
  .insights-card {
    .chart-title {
      margin: 0;
      font-family: var(--font-family-base);
      font-size: var(--font-size-title);
      font-weight: var(--font-weight-heading);
      color: var(--text-primary);
    }
  }
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
  padding: var(--space-xs);
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--color-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-base), transform var(--transition-base), box-shadow var(--transition-base);

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-soft);
  }

  .insight-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid transparent;

    &.trend-up {
      background: var(--color-success-soft);
      color: var(--color-success);
      border-color: var(--color-success-border);
    }

    &.hot-book {
      background: var(--color-info-soft);
      color: var(--color-primary);
      border-color: var(--color-info-border);
    }

    &.active-users {
      background: var(--color-warning-soft);
      color: var(--color-warning);
      border-color: var(--color-warning-border);
    }

    &.avg-duration {
      background: rgba(108, 70, 255, 0.08);
      color: var(--color-accent-purple-deep);
      border-color: rgba(108, 70, 255, 0.2);
    }
  }

  .insight-content {
    flex: 1;

    .insight-label {
      font-family: var(--font-family-base);
      font-size: var(--font-size-caption);
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }

    .insight-value {
      font-family: var(--font-family-base);
      font-size: var(--font-size-heading-3);
      font-weight: var(--font-weight-heading);
      color: var(--text-primary);
      margin-bottom: 4px;

      &.positive {
        color: var(--color-success);
      }
    }

    .insight-desc {
      font-family: var(--font-family-base);
      font-size: var(--font-size-body-sm);
      color: var(--text-secondary);
    }
  }
}

@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .insights-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
