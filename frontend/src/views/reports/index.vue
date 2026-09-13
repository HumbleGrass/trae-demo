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
            <h3 class="chart-title">借阅趋势分析</h3>
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
            <h3 class="chart-title">图书分类分布</h3>
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
            <h3 class="chart-title">月度借阅统计</h3>
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
import { notionChartColors, notionFontFamily, getNotionPieColors } from '@/utils/echarts-tech-theme'

const C = notionChartColors
const F = notionFontFamily

const loading = ref(false)

const stats = reactive({
  totalBooks: 0,
  totalMembers: 0,
  totalBorrows: 0,
  activeBorrows: 0
})

// 借阅趋势图配置
const borrowTrendOptions = ref<any>({
  title: {
    text: '',
    left: 'center',
    textStyle: {
      color: C.textPrimary,
      fontFamily: F,
      fontSize: 16,
      fontWeight: 700
    }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#ffffff',
    borderColor: C.axisLine,
    borderWidth: 1,
    padding: [12, 16],
    textStyle: {
      color: C.textSecondary,
      fontFamily: F,
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
      lineStyle: { color: C.axisLine }
    },
    axisLabel: {
      color: C.axisLabel,
      fontFamily: F
    }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: C.axisLabel,
      fontFamily: F
    },
    splitLine: {
      lineStyle: {
        color: C.axisLine,
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
      color: C.primary,
      width: 3
    },
    itemStyle: {
      color: C.primary,
      borderColor: '#ffffff',
      borderWidth: 2
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(0, 117, 222, 0.18)' },
          { offset: 1, color: 'rgba(0, 117, 222, 0.02)' }
        ]
      }
    }
  }]
})

// 图书分类饼图配置
const categoryPieOptions = ref<any>({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
    backgroundColor: '#ffffff',
    borderColor: C.axisLine
  },
  legend: {
    orient: 'vertical',
    right: 20,
    top: 'center',
    textStyle: {
      color: C.textSecondary,
      fontFamily: F
    }
  },
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    center: ['40%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: {
      borderRadius: 6,
      borderColor: '#ffffff',
      borderWidth: 2
    },
    label: { show: false },
    emphasis: {
      label: {
        show: true,
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: F,
        color: C.primary
      }
    },
    data: [
      { value: 1048, name: '文学小说' },
      { value: 735, name: '科学技术' },
      { value: 580, name: '历史传记' },
      { value: 484, name: '经济管理' },
      { value: 300, name: '艺术设计' }
    ],
    color: getNotionPieColors()
  }]
})

// 月度借阅柱状图配置
const monthlyBorrowOptions = ref<any>({
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#ffffff',
    borderColor: C.axisLine
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
      lineStyle: { color: C.axisLine }
    },
    axisLabel: {
      color: C.axisLabel,
      fontFamily: F,
      rotate: 30
    }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: C.axisLabel,
      fontFamily: F
    },
    splitLine: {
      lineStyle: {
        color: C.axisLine,
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
          { offset: 0, color: C.primary },
          { offset: 1, color: C.accentSky }
        ]
      }
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
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

    &:hover {
      border-color: var(--color-ink-faint);
      box-shadow: var(--shadow-soft);
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
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.books {
        background: var(--color-info-soft);
        color: var(--color-primary);
        border: 1px solid var(--color-info-border);
      }

      &.members {
        background: var(--color-accent-purple);
        color: var(--color-accent-purple-deep);
        border: 1px solid rgba(57, 28, 87, 0.3);
      }

      &.borrows {
        background: var(--color-success-soft);
        color: var(--color-success);
        border: 1px solid var(--color-success-border);
      }

      &.active-borrows {
        background: var(--color-warning-soft);
        color: var(--color-warning);
        border: 1px solid var(--color-warning-border);
      }
    }

    .stat-info {
      .stat-value {
        font-family: var(--font-family-base);
        font-size: 26px;
        font-weight: 700;
        color: var(--text-primary);
        line-height: 1.2;
      }

      .stat-label {
        font-size: 12px;
        color: var(--text-muted);
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
    color: var(--text-primary);
  }
}

.code-text {
  font-family: var(--font-family-base);
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
