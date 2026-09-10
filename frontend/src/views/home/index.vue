<template>
  <div class="home-page">
    <!-- 页面头部 -->
    <div class="page-header tech-fade-in-up">
      <div class="welcome-section">
        <h1 class="welcome-title">知阅阁</h1>
        <p class="welcome-subtitle">{{ greetingText }}</p>
      </div>
      <div class="date-section">
        <div class="time-display">
          <span class="current-time">{{ currentTime }}</span>
          <span class="current-date">{{ currentDate }}</span>
        </div>
      </div>
    </div>

    <!-- 统计卡片区域 -->
    <div class="stats-section tech-fade-in-up" style="animation-delay: 0.1s;">
      <div class="stat-card stat-card--blue">
        <div class="stat-icon-wrapper">
          <div class="stat-icon">
            <el-icon :size="20"><Reading /></el-icon>
          </div>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.todayBorrow }}</div>
          <div class="stat-label">{{ t('home.todayBorrow') }}</div>
        </div>
        <div class="stat-trend">
          <el-icon><TrendCharts /></el-icon>
          <span>+12%</span>
        </div>
      </div>

      <div class="stat-card stat-card--green">
        <div class="stat-icon-wrapper">
          <div class="stat-icon">
            <el-icon :size="20"><CircleCheck /></el-icon>
          </div>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.todayReturn }}</div>
          <div class="stat-label">{{ t('home.todayReturn') }}</div>
        </div>
        <div class="stat-trend">
          <el-icon><TrendCharts /></el-icon>
          <span>+8%</span>
        </div>
      </div>

      <div class="stat-card stat-card--red">
        <div class="stat-icon-wrapper">
          <div class="stat-icon">
            <el-icon :size="20"><Warning /></el-icon>
          </div>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.overdueCount }}</div>
          <div class="stat-label">{{ t('home.overdueCount') }}</div>
        </div>
        <div class="stat-trend negative">
          <el-icon><Bottom /></el-icon>
          <span>-3%</span>
        </div>
      </div>

      <div class="stat-card stat-card--purple">
        <div class="stat-icon-wrapper">
          <div class="stat-icon">
            <el-icon :size="20"><Collection /></el-icon>
          </div>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalBooks }}</div>
          <div class="stat-label">{{ t('home.totalBooks') }}</div>
        </div>
        <div class="stat-trend">
          <el-icon><TrendCharts /></el-icon>
          <span>+5%</span>
        </div>
      </div>
    </div>

    <!-- 内容网格 -->
    <div class="content-grid tech-fade-in-up" style="animation-delay: 0.2s;">
      <div class="grid-main">
        <!-- 图表卡片 -->
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">{{ t('home.borrowTrend') }}</h3>
            <div class="card-actions">
              <el-radio-group v-model="chartPeriod" size="small">
                <el-radio-button value="week">{{ t('home.week') }}</el-radio-button>
                <el-radio-button value="month">{{ t('home.month') }}</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="chart-container">
            <div ref="trendChartRef" class="chart"></div>
          </div>
        </div>

        <!-- 最近活动卡片 -->
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">{{ t('home.recentActivities') }}</h3>
            <el-button type="primary" link class="view-all-btn" size="default" @click="$router.push('/borrow')">
              {{ t('home.viewAll') }}
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
          <div class="activities-list">
            <div class="activity-item" v-for="(activity, index) in recentActivities" :key="index">
              <div class="activity-icon" :class="activity.type">
                <el-icon><component :is="activity.icon" /></el-icon>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
              <el-tag :type="activity.tagType" size="small" class="activity-tag">
                {{ activity.tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-sidebar">
        <!-- 快捷操作卡片 -->
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">{{ t('home.quickActions') }}</h3>
          </div>
          <div class="quick-actions-grid">
            <button class="quick-action-btn" @click="$router.push('/borrow')">
              <div class="action-icon">
                <el-icon :size="22"><Reading /></el-icon>
              </div>
              <span class="action-label">{{ t('home.borrowBook') }}</span>
            </button>
            <button class="quick-action-btn" @click="$router.push('/books')">
              <div class="action-icon">
                <el-icon :size="22"><Plus /></el-icon>
              </div>
              <span class="action-label">{{ t('home.addBook') }}</span>
            </button>
            <button class="quick-action-btn" @click="$router.push('/members')">
              <div class="action-icon">
                <el-icon :size="22"><User /></el-icon>
              </div>
              <span class="action-label">{{ t('home.addMember') }}</span>
            </button>
            <button class="quick-action-btn" @click="$router.push('/reports')">
              <div class="action-icon">
                <el-icon :size="22"><Document /></el-icon>
              </div>
              <span class="action-label">{{ t('home.viewReport') }}</span>
            </button>
          </div>
        </div>

        <!-- 热门图书卡片 -->
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">{{ t('home.popularBooks') }}</h3>
          </div>
          <div class="popular-books-list">
            <div class="popular-book-item" v-for="(book, index) in popularBooks" :key="index" @click="goToBookDetail(book.id)">
              <div class="book-rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
              <div class="book-cover">
                <div class="cover-placeholder" :style="{ background: book.coverColor }">
                  <el-icon><Notebook /></el-icon>
                </div>
              </div>
              <div class="book-info">
                <div class="book-title">{{ book.title }}</div>
                <div class="book-author">{{ book.author }}</div>
              </div>
              <div class="book-borrow-count">
                <el-icon><View /></el-icon>
                <span>{{ book.borrowCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'
import * as echarts from 'echarts'
import {
  Reading,
  CircleCheck,
  Warning,
  Collection,
  TrendCharts,
  Bottom,
  ArrowRight,
  Plus,
  User,
  Document,
  Notebook,
  View,
  Bell,
  Message
} from '@element-plus/icons-vue'
import { getBooks } from '@/api/books'
import { getBorrows } from '@/api/borrow'
import { getDashboardStats, getHotBooks } from '@/api/statistics'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

const trendChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null
let timeInterval: number | null = null

const chartPeriod = ref('week')

const stats = reactive({
  todayBorrow: 0,
  todayReturn: 0,
  overdueCount: 0,
  totalBooks: 0,
  totalMembers: 0,
  activeBorrows: 0
})

const fetchDashboardStats = async () => {
  try {
    const res = await getDashboardStats()
    if (res) {
      stats.todayBorrow = res.todayBorrow || 0
      stats.todayReturn = res.todayReturn || 0
      stats.overdueCount = res.overdueCount || 0
      stats.totalBooks = res.totalBooks || 0
      stats.totalMembers = res.totalMembers || 0
      stats.activeBorrows = res.activeBorrows || 0
    }
  } catch (error) {
    // silently ignore
  }
}

const recentActivities = ref<any[]>([])

const fetchRecentActivities = async () => {
  try {
    const res = await getBorrows({ pageSize: 5 })
    if (res && res.data) {
      recentActivities.value = res.data.map((record: any) => {
        const isToday = new Date(record.borrowDate).toDateString() === new Date().toDateString()
        const timeAgo = getTimeAgo(record.borrowDate)

        return {
          type: record.status === 'returned' ? 'return' : 'borrow',
          icon: record.status === 'returned' ? CircleCheck : Reading,
          title: `${record.member?.name || '用户'}${record.status === 'returned' ? '归还' : '借阅'}了《${record.book?.title || '未知图书'}》`,
          time: timeAgo,
          tag: record.status === 'returned' ? '归还' : '借阅',
          tagType: record.status === 'returned' ? 'success' : 'primary'
        }
      })
    }
  } catch (error) {
    console.error('Failed to fetch recent activities:', error)
  }
}

const getTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`
  return date.toLocaleDateString('zh-CN')
}

const popularBooks = ref<any[]>([])

const coverColors = [
  'linear-gradient(135deg, #8b6f47 0%, #a88d66 100%)',
  'linear-gradient(135deg, #4a5d6a 0%, #6a7d8a 100%)',
  'linear-gradient(135deg, #5a8a6e 0%, #7aaa8e 100%)',
  'linear-gradient(135deg, #c9a86c 0%, #d9b87c 100%)',
  'linear-gradient(135deg, #4a7a9a 0%, #6a9aba 100%)',
  'linear-gradient(135deg, #a85a5a 0%, #c87a7a 100%)'
]

const fetchPopularBooks = async () => {
  try {
    const res = await getHotBooks(4)
    if (res && res.length > 0) {
      popularBooks.value = res.map((book: any, index: number) => ({
        id: book.bookId,
        title: book.title,
        author: book.author,
        borrowCount: book.borrowCount || 0,
        coverColor: coverColors[index % coverColors.length]
      }))
    } else {
      const booksRes = await getBooks({ pageSize: 4 })
      if (booksRes && booksRes.data) {
        popularBooks.value = booksRes.data.map((book: any, index: number) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          borrowCount: 0,
          coverColor: coverColors[index % coverColors.length]
        }))
      }
    }
  } catch (error) {
    popularBooks.value = []
  }
}

const goToBookDetail = (bookId: number) => {
  router.push(`/books/${bookId}`)
}

const greetingText = ref('')
const currentDate = ref('')
const currentTime = ref('')

const updateDateTime = () => {
  const now = new Date()
  const hour = now.getHours()

  if (hour < 6) {
    greetingText.value = '夜深了，注意休息'
  } else if (hour < 12) {
    greetingText.value = '早上好，开启新的一天'
  } else if (hour < 14) {
    greetingText.value = '中午好，享受午餐时光'
  } else if (hour < 18) {
    greetingText.value = '下午好，继续努力'
  } else if (hour < 22) {
    greetingText.value = '晚上好，放松一下'
  } else {
    greetingText.value = '夜深了，早点休息'
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }
  currentDate.value = now.toLocaleDateString('zh-CN', dateOptions)

  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const initTrendChart = () => {
  if (!trendChartRef.value) return

  trendChart = echarts.init(trendChartRef.value)

  const NOTION_BORDER = '#e6e6e6'
  const NOTION_MUTED = '#615d59'
  const NOTION_BLUE = '#0075de'
  const NOTION_GREEN = '#1a7f37'

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: NOTION_BORDER,
      borderWidth: 1,
      textStyle: {
        color: '#000000',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
      }
    },
    legend: {
      data: ['借阅', '归还'],
      top: 0,
      textStyle: {
        color: NOTION_MUTED,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: {
        lineStyle: {
          color: NOTION_BORDER
        }
      },
      axisLabel: {
        color: NOTION_MUTED,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: NOTION_BORDER,
          type: 'dashed'
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: NOTION_MUTED,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
      }
    },
    series: [
      {
        name: '借阅',
        type: 'line',
        smooth: true,
        stack: 'Total',
        data: [12, 19, 15, 25, 18, 22, 24],
        lineStyle: {
          color: NOTION_BLUE,
          width: 2
        },
        itemStyle: {
          color: NOTION_BLUE
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 117, 222, 0.15)' },
              { offset: 1, color: 'rgba(0, 117, 222, 0)' }
            ]
          }
        }
      },
      {
        name: '归还',
        type: 'line',
        smooth: true,
        stack: 'Total',
        data: [8, 12, 10, 18, 14, 16, 18],
        lineStyle: {
          color: NOTION_GREEN,
          width: 2
        },
        itemStyle: {
          color: NOTION_GREEN
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(26, 127, 55, 0.15)' },
              { offset: 1, color: 'rgba(26, 127, 55, 0)' }
            ]
          }
        }
      }
    ]
  }

  trendChart.setOption(option)
}

const handleResize = () => {
  trendChart?.resize()
}

const updateChartData = (period: string) => {
  if (!trendChart) return

  const weekData = {
    xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    borrowData: [12, 19, 15, 25, 18, 22, 24],
    returnData: [8, 12, 10, 18, 14, 16, 18]
  }

  const monthData = {
    xAxis: ['第1周', '第2周', '第3周', '第4周'],
    borrowData: [85, 92, 78, 95],
    returnData: [72, 80, 68, 82]
  }

  const data = period === 'week' ? weekData : monthData

  trendChart.setOption({
    xAxis: {
      data: data.xAxis
    },
    series: [
      {
        name: '借阅',
        data: data.borrowData
      },
      {
        name: '归还',
        data: data.returnData
      }
    ]
  })
}

watch(chartPeriod, (newVal) => {
  updateChartData(newVal)
})

watch(() => notificationStore.refreshKey, () => {
  fetchRecentActivities()
})

onMounted(() => {
  updateDateTime()
  timeInterval = window.setInterval(updateDateTime, 1000)

  nextTick(() => {
    initTrendChart()
  })

  fetchDashboardStats()
  fetchPopularBooks()
  fetchRecentActivities()

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
})
</script>

<style lang="scss" scoped>
.home-page {
  position: relative;
  min-height: 100%;
  padding: 32px;
  background: var(--surface-page);
}

// ============ Page Header ============
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.welcome-section {
  .welcome-title {
    font-family: var(--font-family-base);
    font-size: var(--font-size-heading-1);
    font-weight: var(--font-weight-heading);
    color: var(--text-primary);
    margin: 0 0 6px 0;
    line-height: var(--line-height-heading-1);
    letter-spacing: var(--letter-spacing-default);
  }

  .welcome-subtitle {
    font-family: var(--font-family-base);
    font-size: var(--font-size-body-sm);
    color: var(--text-muted);
    margin: 0;
    font-weight: var(--font-weight-body);
  }
}

.date-section {
  text-align: right;
}

.time-display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .current-time {
    font-family: var(--font-family-base);
    font-size: 22px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.2;
    margin-bottom: 4px;
    font-variant-numeric: tabular-nums;
  }

  .current-date {
    font-family: var(--font-family-base);
    font-size: var(--font-size-caption);
    color: var(--text-muted);
    line-height: 1.2;
  }
}

// ============ Stats Section ============
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--surface-panel);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: 20px 22px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: box-shadow var(--transition-base), border-color var(--transition-base);

  &:hover {
    box-shadow: var(--shadow-soft);
    border-color: var(--color-ink-faint);
  }

  // Sticker-palette icon backgrounds (decorative, no glow)
  &--blue {
    .stat-icon {
      background: var(--color-info-soft);
      color: var(--color-primary);
    }
  }
  &--green {
    .stat-icon {
      background: var(--color-success-soft);
      color: var(--color-success);
    }
  }
  &--red {
    .stat-icon {
      background: var(--color-danger-soft);
      color: var(--color-danger);
    }
  }
  &--purple {
    .stat-icon {
      background: #f1edff;
      color: var(--color-accent-purple-deep);
    }
  }
}

.stat-icon-wrapper {
  flex-shrink: 0;
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
  min-width: 0;

  .stat-value {
    font-family: var(--font-family-base);
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.1;
    margin-bottom: 2px;
    font-variant-numeric: tabular-nums;
  }

  .stat-label {
    font-family: var(--font-family-base);
    font-size: 13px;
    color: var(--text-muted);
    font-weight: var(--font-weight-body);
  }
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 3px;
  font-family: var(--font-family-base);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-success);
  padding: 4px 8px;
  background: var(--color-success-soft);
  border-radius: var(--radius-sm);
  font-variant-numeric: tabular-nums;

  &.negative {
    color: var(--color-danger);
    background: var(--color-danger-soft);
  }
}

// ============ Content Grid ============
.content-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
}

.grid-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.grid-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content-card {
  background: var(--surface-panel);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: box-shadow var(--transition-base), border-color var(--transition-base);

  &:hover {
    box-shadow: var(--shadow-soft);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  border-bottom: 1px solid var(--border-default);

  .card-title {
    font-family: var(--font-family-base);
    font-size: var(--font-size-title);
    font-weight: var(--font-weight-title);
    color: var(--text-primary);
    margin: 0;
  }
}

.view-all-btn {
  font-family: var(--font-family-base);
  font-size: var(--font-size-caption);
  padding: 4px 8px;
  color: var(--color-primary);

  &:hover {
    background: var(--color-info-soft);
  }
}

.chart-container {
  padding: 20px 22px;

  .chart {
    width: 100%;
    height: 320px;
  }
}

// ============ Activities ============
.activities-list {
  padding: 6px 0;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 22px;
  transition: background var(--transition-fast);

  &:hover {
    background: var(--color-canvas-soft);
  }
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.borrow {
    background: var(--color-info-soft);
    color: var(--color-primary);
  }

  &.return {
    background: var(--color-success-soft);
    color: var(--color-success);
  }
}

.activity-content {
  flex: 1;
  min-width: 0;

  .activity-title {
    font-family: var(--font-family-base);
    font-size: var(--font-size-body-md);
    color: var(--text-primary);
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .activity-time {
    font-family: var(--font-family-base);
    font-size: var(--font-size-caption);
    color: var(--text-muted);
  }
}

.activity-tag {
  flex-shrink: 0;
}

// ============ Quick Actions ============
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 18px 20px;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px 14px;
  background: var(--color-canvas-soft);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast);
  font-family: var(--font-family-base);

  &:hover {
    background: #eeeeec;
    border-color: var(--color-ink-faint);
  }

  &:active {
    background: #e8e7e5;
  }

  .action-icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    background: var(--color-info-soft);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-label {
    font-size: var(--font-size-caption);
    color: var(--text-secondary);
    font-weight: 500;
  }
}

// ============ Popular Books ============
.popular-books-list {
  padding: 6px 0;
}

.popular-book-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  transition: background var(--transition-fast);
  cursor: pointer;

  &:hover {
    background: var(--color-canvas-soft);
  }
}

.book-rank {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  font-family: var(--font-family-base);
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.rank-1 {
    background: #fff4dc;
    color: #b35900;
  }
  &.rank-2 {
    background: #e9e9e7;
    color: #5f5f5c;
  }
  &.rank-3 {
    background: #f3e3d3;
    color: #8c4a1f;
  }
  &.rank-4 {
    background: var(--color-canvas-soft);
    color: var(--text-muted);
  }
}

.book-cover {
  flex-shrink: 0;
}

.cover-placeholder {
  width: 40px;
  height: 52px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  flex-shrink: 0;
}

.book-info {
  flex: 1;
  min-width: 0;

  .book-title {
    font-family: var(--font-family-base);
    font-size: var(--font-size-body-md);
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .book-author {
    font-family: var(--font-family-base);
    font-size: var(--font-size-caption);
    color: var(--text-muted);
  }
}

.book-borrow-count {
  display: flex;
  align-items: center;
  gap: 3px;
  font-family: var(--font-family-base);
  font-size: var(--font-size-caption);
  color: var(--text-muted);
  flex-shrink: 0;
}

// ============ Fade-in animation (opacity only, no blur) ============
.tech-fade-in-up {
  animation: fade-in-up 0.4s var(--ease-standard) forwards;
  opacity: 0;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ============ Radio button styling ============
:deep(.el-radio-group) {
  .el-radio-button__inner {
    background: var(--color-canvas-soft);
    border: 1px solid var(--border-default);
    color: var(--text-muted);
    font-family: var(--font-family-base);

    &:hover {
      color: var(--text-primary);
    }
  }

  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background: var(--color-info-soft);
    border-color: var(--color-primary);
    color: var(--color-primary);
    box-shadow: none;
  }
}

// ============ Responsive ============
@media (max-width: 1200px) {
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .grid-sidebar {
    flex-direction: row;
  }

  .quick-actions-card,
  .popular-books-card {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: 20px;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;

    .date-section {
      text-align: left;
    }
  }

  .grid-sidebar {
    flex-direction: column;
  }
}
</style>
