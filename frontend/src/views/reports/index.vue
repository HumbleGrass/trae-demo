<template>
  <TechPageLayout title="统计报表" subtitle="图书馆运营数据统计分析">
    <div class="reports-content fade-in-up">
      <!-- 统计卡片 -->
      <div class="stats-grid fade-in-up delay-1">
        <TechCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon books">
              <el-icon :size="28"><Notebook /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value code-text">{{ stats.totalBooks }}</div>
              <div class="stat-label">图书总数</div>
            </div>
          </div>
        </TechCard>

        <TechCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon members">
              <el-icon :size="28"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value code-text">{{ stats.totalMembers }}</div>
              <div class="stat-label">会员总数</div>
            </div>
          </div>
        </TechCard>

        <TechCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon borrows">
              <el-icon :size="28"><Reading /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value code-text">{{ stats.totalBorrows }}</div>
              <div class="stat-label">借阅总量</div>
            </div>
          </div>
        </TechCard>

        <TechCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon active-borrows">
              <el-icon :size="28"><Collection /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value code-text">{{ stats.activeBorrows }}</div>
              <div class="stat-label">当前借出</div>
            </div>
          </div>
        </TechCard>
      </div>

      <!-- 图表区域 -->
      <div class="charts-grid fade-in-up delay-2">
        <!-- 借阅趋势图 -->
        <TechCard class="chart-card">
          <template #header>
            <h3 class="chart-title neon-text">
              <span class="title-icon">▸</span>
              借阅趋势分析
              <span class="data-stream">▋</span>
            </h3>
          </template>
          <Chart 
            :options="borrowTrendOptions" 
            height="350px"
            :loading="loading"
          />
        </TechCard>

        <!-- 图书分类统计 -->
        <TechCard class="chart-card">
          <template #header>
            <h3 class="chart-title neon-text">
              <span class="title-icon">▸</span>
              图书分类分布
              <span class="data-stream">▋</span>
            </h3>
          </template>
          <Chart 
            :options="categoryPieOptions" 
            height="350px"
            :loading="loading"
          />
        </TechCard>
      </div>

      <!-- 第二行图表 -->
      <div class="charts-grid fade-in-up delay-3">
        <!-- 月度借阅量 -->
        <TechCard class="chart-card full-width">
          <template #header>
            <h3 class="chart-title neon-text">
              <span class="title-icon">▸</span>
              月度借阅统计
              <span class="data-stream">▋</span>
            </h3>
          </template>
          <Chart 
            :options="monthlyBorrowOptions" 
            height="300px"
            :loading="loading"
          />
        </TechCard>
      </div>
    </div>
  </TechPageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Notebook, User, Reading, Collection } from '@element-plus/icons-vue'
import { getBooks } from '@/api/books'
import { getMembers } from '@/api/members'
import { getBorrows } from '@/api/borrow'
import Chart from '@/components/Chart/index.vue'
import TechPageLayout from '@/components/layout/TechPageLayout.vue'
import TechCard from '@/components/common/TechCard.vue'

const loading = ref(false)

const stats = reactive({
  totalBooks: 0,
  totalMembers: 0,
  totalBorrows: 0,
  activeBorrows: 0
})

// 借阅趋势图配置 - 科技风格
const borrowTrendOptions = ref<any>({
  title: {
    text: '',
    left: 'center',
    textStyle: {
      color: '#e0e0ff',
      fontFamily: 'Inter, sans-serif',
      fontSize: 16,
      fontWeight: 700
    }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(20, 20, 40, 0.95)',
    borderColor: 'rgba(0, 243, 255, 0.3)',
    borderWidth: 1,
    padding: [12, 16],
    textStyle: {
      color: '#e0e0ff',
      fontFamily: 'Inter, sans-serif',
      fontSize: 13
    }
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
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
    axisLine: {
      lineStyle: { color: 'rgba(0, 243, 255, 0.2)' }
    },
    axisLabel: {
      color: '#8080a0',
      fontFamily: 'JetBrains Mono, monospace'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#8080a0',
      fontFamily: 'JetBrains Mono, monospace'
    },
    splitLine: {
      lineStyle: { 
        color: 'rgba(0, 243, 255, 0.1)',
        type: 'dashed' as const
      }
    }
  },
  series: [{
    name: '借阅量',
    data: [120, 200, 150, 80, 70, 110, 130],
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

// 图书分类饼图 - 科技风格
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
    textStyle: {
      color: '#b0b0d0',
      fontFamily: 'Inter, sans-serif'
    }
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
      { value: 1048, name: '文学小说' },
      { value: 735, name: '科学技术' },
      { value: 580, name: '历史传记' },
      { value: 484, name: '经济管理' },
      { value: 300, name: '艺术设计' }
    ],
    color: ['#00f3ff', '#ff00ff', '#00ff88', '#ffaa00', '#ff3366']
  }]
})

// 月度借阅柱状图 - 科技风格
const monthlyBorrowOptions = ref<any>({
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
    data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    axisLine: {
      lineStyle: { color: 'rgba(0, 243, 255, 0.2)' }
    },
    axisLabel: {
      color: '#8080a0',
      fontFamily: 'JetBrains Mono, monospace',
      rotate: 30
    }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#8080a0',
      fontFamily: 'JetBrains Mono, monospace'
    },
    splitLine: {
      lineStyle: { 
        color: 'rgba(0, 243, 255, 0.1)',
        type: 'dashed' as const
      }
    }
  },
  series: [{
    name: '借阅量',
    data: [120, 200, 150, 80, 70, 110, 130, 160, 180, 140, 170, 190],
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

const fetchStats = async () => {
  loading.value = true
  try {
    const booksRes = await getBooks({ pageSize: 1000 })
    const membersRes = await getMembers({ pageSize: 1000 })
    const borrowsRes = await getBorrows({ pageSize: 1000 })

    if (Array.isArray(booksRes)) {
      stats.totalBooks = booksRes.length
    }

    if (Array.isArray(membersRes)) {
      stats.totalMembers = membersRes.length
    }

    if (Array.isArray(borrowsRes)) {
      stats.totalBorrows = borrowsRes.length
      stats.activeBorrows = borrowsRes.filter((b: any) => b.status === 'BORROWED').length
    }
  } catch (error) {
    // silently ignore
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style lang="scss" scoped>
.reports-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  .stat-card {
    transition: all var(--tech-transition-base);

    &:hover {
      transform: translateY(-4px);
      border-color: var(--tech-border-strong);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--tech-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.books {
        background: rgba(0, 245, 255, 0.1);
        color: var(--tech-neon-cyan);
        border: 1px solid var(--tech-neon-cyan);
        box-shadow: 0 0 15px rgba(0, 245, 255, 0.2);
      }

      &.members {
        background: rgba(255, 0, 255, 0.1);
        color: var(--tech-neon-magenta);
        border: 1px solid var(--tech-neon-magenta);
        box-shadow: 0 0 15px rgba(255, 0, 255, 0.2);
      }

      &.borrows {
        background: rgba(0, 255, 136, 0.1);
        color: var(--tech-neon-green);
        border: 1px solid var(--tech-neon-green);
        box-shadow: 0 0 15px rgba(0, 255, 136, 0.2);
      }

      &.active-borrows {
        background: rgba(255, 190, 11, 0.1);
        color: var(--tech-neon-yellow);
        border: 1px solid var(--tech-neon-yellow);
        box-shadow: 0 0 15px rgba(255, 190, 11, 0.2);
      }
    }

    .stat-info {
      .stat-value {
        font-family: var(--tech-font-display);
        font-size: 26px;
        font-weight: 700;
        color: var(--tech-text-primary);
        line-height: 1.2;
      }

      .stat-label {
        font-size: 12px;
        color: var(--tech-text-muted);
        margin-top: 4px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
  }
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  &.full-width {
    grid-template-columns: 1fr;
  }
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

@keyframes blink {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.code-text {
  font-family: var(--tech-font-mono);
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
