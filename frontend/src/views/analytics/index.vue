<template>
  <TechPageLayout title="数据分析" subtitle="深度数据洞察与趋势分析">
    <div class="analytics-content fade-in-up" v-loading="loading">
      <!-- 图表网格 -->
      <div class="charts-grid fade-in-up delay-1">
        <!-- 借阅趋势 -->
        <TechCard class="chart-card">
          <template #header>
            <h3 class="chart-title neon-text">
              <span class="title-icon">▸</span>
              借阅趋势
              <span class="data-stream">▋</span>
            </h3>
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
            <h3 class="chart-title neon-text">
              <span class="title-icon">▸</span>
              分类占比
              <span class="data-stream">▋</span>
            </h3>
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
            <h3 class="chart-title neon-text">
              <span class="title-icon">▸</span>
              会员活跃度
              <span class="data-stream">▋</span>
            </h3>
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
            <h3 class="chart-title neon-text">
              <span class="title-icon">▸</span>
              借阅时长分布
              <span class="data-stream">▋</span>
            </h3>
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
            <h3 class="chart-title neon-text">
              <span class="title-icon">▸</span>
              关键数据洞察
              <span class="data-stream">▋</span>
            </h3>
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
    axisLine: { lineStyle: { color: 'rgba(0, 243, 255, 0.2)' } },
    axisLabel: { color: '#8080a0', fontFamily: 'JetBrains Mono, monospace' }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#8080a0', fontFamily: 'JetBrains Mono, monospace' },
    splitLine: { lineStyle: { color: 'rgba(0, 243, 255, 0.1)', type: 'dashed' as const } }
  },
  series: [{
    name: '借阅量',
    data: [150, 230, 224, 218, 135, 147, 260],
    type: 'line',
    smooth: true,
    lineStyle: {
      color: '#00f3ff',
      width: 3,
      shadowColor: '#00f3ff',
      shadowBlur: 10
    },
    itemStyle: {
      color: '#00f3ff',
      borderColor: '#fff',
      borderWidth: 2
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(0, 243, 255, 0.25)' },
          { offset: 1, color: 'rgba(0, 243, 255, 0.02)' }
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
    borderColor: 'rgba(0, 243, 255, 0.3)'
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
        color: '#00f3ff'
      }
    },
    data: [
      { value: 735, name: '文学小说' },
      { value: 580, name: '科学技术' },
      { value: 484, name: '历史传记' },
      { value: 300, name: '经济管理' },
      { value: 200, name: '艺术设计' }
    ],
    color: ['#00f3ff', '#ff00ff', '#00ff88', '#ffaa00', '#ff3366']
  }]
})

// 会员活跃度 - 科技风格柱状图
const memberActivityOptions = ref<any>({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 20, 40, 0.95)',
    borderColor: 'rgba(0, 243, 255, 0.3)'
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
    axisLine: { lineStyle: { color: 'rgba(0, 243, 255, 0.2)' } },
    axisLabel: { color: '#8080a0', fontFamily: 'JetBrains Mono, monospace' }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#8080a0', fontFamily: 'JetBrains Mono, monospace' },
    splitLine: { lineStyle: { color: 'rgba(0, 243, 255, 0.1)', type: 'dashed' as const } }
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
          { offset: 0, color: '#33e0ff' },
          { offset: 1, color: '#00c8d4' }
        ]
      },
      shadowColor: 'rgba(0, 243, 255, 0.4)',
      shadowBlur: 12
    }
  }]
})

// 借阅时长分布 - 科技风格
const durationDistributionOptions = ref<any>({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 20, 40, 0.95)',
    borderColor: 'rgba(0, 243, 255, 0.3)'
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
    axisLine: { lineStyle: { color: 'rgba(0, 243, 255, 0.2)' } },
    axisLabel: { color: '#8080a0', fontFamily: 'JetBrains Mono, monospace' }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#8080a0', fontFamily: 'JetBrains Mono, monospace' },
    splitLine: { lineStyle: { color: 'rgba(0, 243, 255, 0.1)', type: 'dashed' as const } }
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
          { offset: 0, color: '#ff00ff' },
          { offset: 1, color: '#cc00cc' }
        ]
      },
      shadowColor: 'rgba(255, 0, 255, 0.4)',
      shadowBlur: 12
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
  gap: 20px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.chart-card {
  
  .chart-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;

    .title-icon {
      color: var(--tech-neon-cyan);
      font-size: 14px;
    }

    .data-stream {
      color: var(--tech-neon-cyan);
      opacity: 0.5;
      animation: blink 1s ease-in-out infinite;
    }
  }
}

.insights-section {
  
  .insights-card {
    
    .chart-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;

      .title-icon {
        color: var(--tech-neon-cyan);
        font-size: 14px;
      }

      .data-stream {
        color: var(--tech-neon-cyan);
        opacity: 0.5;
        animation: blink 1s ease-in-out infinite;
      }
    }
  }
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 8px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: var(--tech-bg-dark);
  border: 1px solid var(--tech-border-color);
  border-radius: var(--tech-radius-sm);
  transition: all var(--tech-transition-base);

  &:hover {
    border-color: var(--tech-primary-400);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 245, 255, 0.1);
  }

  .insight-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--tech-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &.trend-up {
      background: rgba(0, 255, 136, 0.1);
      color: var(--tech-neon-green);
      border: 1px solid var(--tech-neon-green);
      box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
    }

    &.hot-book {
      background: rgba(0, 245, 255, 0.1);
      color: var(--tech-neon-cyan);
      border: 1px solid var(--tech-neon-cyan);
      box-shadow: 0 0 10px rgba(0, 245, 255, 0.2);
    }

    &.active-users {
      background: rgba(255, 0, 255, 0.1);
      color: var(--tech-neon-magenta);
      border: 1px solid var(--tech-neon-magenta);
      box-shadow: 0 0 10px rgba(255, 0, 255, 0.2);
    }

    &.avg-duration {
      background: rgba(255, 190, 11, 0.1);
      color: var(--tech-neon-yellow);
      border: 1px solid var(--tech-neon-yellow);
      box-shadow: 0 0 10px rgba(255, 190, 11, 0.2);
    }
  }

  .insight-content {
    flex: 1;

    .insight-label {
      font-size: 11px;
      color: var(--tech-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }

    .insight-value {
      font-family: var(--tech-font-display);
      font-size: 18px;
      font-weight: 700;
      color: var(--tech-text-primary);
      margin-bottom: 4px;

      &.positive {
        color: var(--tech-neon-green);
        text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
      }
    }

    .insight-desc {
      font-size: 13px;
      color: var(--tech-text-secondary);
      font-family: var(--tech-font-body);
    }
  }
}

@keyframes blink {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.code-text {
  font-family: var(--tech-font-mono);
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
