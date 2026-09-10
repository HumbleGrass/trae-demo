<template>
  <div class="tech-home-page">
    <!-- 网格背景 -->
    <div class="tech-grid-bg"></div>

    <!-- 扫描线效果 -->
    <div class="scanline-effect"></div>

    <!-- 页面头部 -->
    <div class="page-header tech-fade-in-up">
      <div class="welcome-section">
        <h1 class="welcome-title">
          <span class="glitch-text" data-text="知阅阁">知阅阁</span>
        </h1>
        <p class="welcome-subtitle">{{ greetingText }}</p>
      </div>
      <div class="date-section">
        <div class="tech-time-display">
          <span class="current-time">{{ currentTime }}</span>
          <span class="current-date">{{ currentDate }}</span>
        </div>
      </div>
    </div>

    <!-- 统计卡片区域 -->
    <div class="stats-section tech-fade-in-up" style="animation-delay: 0.1s;">
      <div class="tech-stat-card today-borrow">
        <div class="stat-icon-wrapper">
          <div class="stat-icon">
            <el-icon :size="28"><Reading /></el-icon>
          </div>
          <div class="icon-glow"></div>
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

      <div class="tech-stat-card today-return">
        <div class="stat-icon-wrapper">
          <div class="stat-icon">
            <el-icon :size="28"><CircleCheck /></el-icon>
          </div>
          <div class="icon-glow"></div>
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

      <div class="tech-stat-card overdue">
        <div class="stat-icon-wrapper">
          <div class="stat-icon">
            <el-icon :size="28"><Warning /></el-icon>
          </div>
          <div class="icon-glow"></div>
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

      <div class="tech-stat-card total-books">
        <div class="stat-icon-wrapper">
          <div class="stat-icon">
            <el-icon :size="28"><Collection /></el-icon>
          </div>
          <div class="icon-glow"></div>
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
        <div class="tech-chart-card">
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
        <div class="tech-activities-card">
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
        <div class="tech-quick-actions-card">
          <div class="card-header">
            <h3 class="card-title">{{ t('home.quickActions') }}</h3>
          </div>
          <div class="quick-actions-grid">
            <button class="tech-quick-action-btn" @click="$router.push('/borrow')">
              <div class="action-icon">
                <el-icon :size="24"><Reading /></el-icon>
              </div>
              <span class="action-label">{{ t('home.borrowBook') }}</span>
              <div class="action-glow"></div>
            </button>
            <button class="tech-quick-action-btn" @click="$router.push('/books')">
              <div class="action-icon">
                <el-icon :size="24"><Plus /></el-icon>
              </div>
              <span class="action-label">{{ t('home.addBook') }}</span>
              <div class="action-glow"></div>
            </button>
            <button class="tech-quick-action-btn" @click="$router.push('/members')">
              <div class="action-icon">
                <el-icon :size="24"><User /></el-icon>
              </div>
              <span class="action-label">{{ t('home.addMember') }}</span>
              <div class="action-glow"></div>
            </button>
            <button class="tech-quick-action-btn" @click="$router.push('/reports')">
              <div class="action-icon">
                <el-icon :size="24"><Document /></el-icon>
              </div>
              <span class="action-label">{{ t('home.viewReport') }}</span>
              <div class="action-glow"></div>
            </button>
          </div>
        </div>

        <!-- 热门图书卡片 -->
        <div class="tech-popular-books-card">
          <div class="card-header">
            <h3 class="card-title">{{ t('home.popularBooks') }}</h3>
          </div>
          <div class="popular-books-list">
            <div class="popular-book-item" v-for="(book, index) in popularBooks" :key="index" @click="goToBookDetail(book.id)">
              <div class="book-rank">{{ index + 1 }}</div>
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

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 15, 35, 0.95)',
      borderColor: 'rgba(0, 243, 255, 0.3)',
      borderWidth: 1,
      textStyle: {
        color: '#e0e0ff',
        fontFamily: 'Inter, sans-serif'
      }
    },
    legend: {
      data: ['借阅', '归还'],
      top: 0,
      textStyle: {
        color: '#8080a0',
        fontFamily: 'Inter, sans-serif'
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
          color: 'rgba(0, 243, 255, 0.2)'
        }
      },
      axisLabel: {
        color: '#8080a0',
        fontFamily: 'Inter, sans-serif'
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 243, 255, 0.05)',
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
        color: '#8080a0',
        fontFamily: 'Inter, sans-serif'
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
          color: '#00f3ff',
          width: 3,
          shadowColor: 'rgba(0, 243, 255, 0.5)',
          shadowBlur: 10
        },
        itemStyle: {
          color: '#00f3ff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 243, 255, 0.3)' },
              { offset: 1, color: 'rgba(0, 243, 255, 0)' }
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
          color: '#00ff88',
          width: 3,
          shadowColor: 'rgba(0, 255, 136, 0.5)',
          shadowBlur: 10
        },
        itemStyle: {
          color: '#00ff88'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 255, 136, 0.3)' },
              { offset: 1, color: 'rgba(0, 255, 136, 0)' }
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
.tech-home-page {
  position: relative;
  min-height: 100%;
  padding: 32px;
  z-index: 1;
}

// 网格背景
.tech-grid-bg {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 243, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 243, 255, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  z-index: 0;
}

// 扫描线效果
.scanline-effect {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      transparent,
      rgba(0, 243, 255, 0.08),
      transparent
    );
    animation: scanline 8s linear infinite;
  }
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}

.welcome-section {
  .welcome-title {
    font-family: var(--font-family-base);
    font-size: 36px;
    font-weight: 800;
    margin: 0 0 8px 0;
    letter-spacing: 4px;
    background: linear-gradient(135deg, #00f3ff 0%, #00c8d4 50%, #00ff88 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 40px rgba(0, 243, 255, 0.3);
    line-height: 1.2;
  }

  .welcome-subtitle {
    font-family: var(--font-family-base);
    font-size: 15px;
    color: #8080a0;
    margin: 0;
    font-weight: 400;
  }
}

// 故障文字效果
.glitch-text {
  position: relative;
  display: inline-block;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  color: #ff00ff;
  animation: glitch-1 2s infinite linear alternate-reverse;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.glitch-text::after {
  color: #00f3ff;
  animation: glitch-2 3s infinite linear alternate-reverse;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
}

@keyframes glitch-1 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

@keyframes glitch-2 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(2px, -2px); }
  40% { transform: translate(2px, 2px); }
  60% { transform: translate(-2px, -2px); }
  80% { transform: translate(-2px, 2px); }
}

.date-section {
  text-align: right;
}

.tech-time-display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .current-time {
    font-family: var(--font-family-base);
    font-size: 28px;
    font-weight: 700;
    color: #00f3ff;
    text-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
    line-height: 1.2;
    margin-bottom: 4px;
  }

  .current-date {
    font-family: var(--font-family-base);
    font-size: 13px;
    color: #8080a0;
    line-height: 1.2;
  }
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.tech-stat-card {
  background: rgba(20, 20, 40, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 243, 255, 0.2);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #00f3ff, #ff00ff, #00ff88, #00f3ff);
    background-size: 300% 100%;
    animation: gradient-shift 3s linear infinite;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(0, 243, 255, 0.4);
    box-shadow:
      0 20px 48px rgba(0, 0, 0, 0.5),
      0 0 40px rgba(0, 243, 255, 0.1);
  }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}

.stat-icon-wrapper {
  flex-shrink: 0;
  position: relative;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.icon-glow {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 243, 255, 0.3) 0%, transparent 70%);
  animation: pulse-neon 2s ease-in-out infinite;
  z-index: 1;
}

@keyframes pulse-neon {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.today-borrow {
  .stat-icon {
    background: linear-gradient(135deg, rgba(0, 102, 255, 0.2) 0%, rgba(0, 102, 255, 0.1) 100%);
    color: #0066ff;
  }
  .icon-glow {
    background: radial-gradient(circle, rgba(0, 102, 255, 0.3) 0%, transparent 70%);
  }
}

.today-return {
  .stat-icon {
    background: linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.1) 100%);
    color: #00ff88;
  }
  .icon-glow {
    background: radial-gradient(circle, rgba(0, 255, 136, 0.3) 0%, transparent 70%);
  }
}

.overdue {
  .stat-icon {
    background: linear-gradient(135deg, rgba(255, 51, 102, 0.2) 0%, rgba(255, 51, 102, 0.1) 100%);
    color: #ff3366;
  }
  .icon-glow {
    background: radial-gradient(circle, rgba(255, 51, 102, 0.3) 0%, transparent 70%);
  }
}

.total-books {
  .stat-icon {
    background: linear-gradient(135deg, rgba(0, 243, 255, 0.2) 0%, rgba(0, 243, 255, 0.1) 100%);
    color: #00f3ff;
  }
  .icon-glow {
    background: radial-gradient(circle, rgba(0, 243, 255, 0.3) 0%, transparent 70%);
  }
}

.stat-content {
  flex: 1;

  .stat-value {
    font-family: var(--font-family-base);
    font-size: 32px;
    font-weight: 700;
    color: #e0e0ff;
    line-height: 1.2;
    margin-bottom: 4px;
  }

  .stat-label {
    font-family: var(--font-family-base);
    font-size: 13px;
    color: #8080a0;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-family-base);
  font-size: 13px;
  color: #00ff88;
  padding: 6px 10px;
  background: rgba(0, 255, 136, 0.1);
  border-radius: 8px;

  &.negative {
    color: #ff3366;
    background: rgba(255, 51, 102, 0.1);
  }
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  position: relative;
  z-index: 1;
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

.tech-chart-card,
.tech-activities-card,
.tech-quick-actions-card,
.tech-popular-books-card {
  background: rgba(20, 20, 40, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 243, 255, 0.2);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(0, 243, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 243, 255, 0.1);

  .card-title {
    font-family: var(--font-family-base);
    font-size: 18px;
    font-weight: 600;
    color: #e0e0ff;
    margin: 0;
    letter-spacing: 1px;
  }
}

.view-all-btn {
  font-family: var(--font-family-base);
  font-size: 13px;
  padding: 4px 8px;
  color: #8080a0;

  &:hover {
    color: #00f3ff;
    background: rgba(0, 243, 255, 0.05);
  }
}

.chart-container {
  padding: 24px;

  .chart {
    width: 100%;
    height: 320px;
  }
}

.activities-list {
  padding: 8px 0;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 24px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 243, 255, 0.05);
  }
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.borrow {
    background: rgba(0, 102, 255, 0.15);
    color: #0066ff;
  }

  &.return {
    background: rgba(0, 255, 136, 0.15);
    color: #00ff88;
  }
}

.activity-content {
  flex: 1;
  min-width: 0;

  .activity-title {
    font-family: var(--font-family-base);
    font-size: 14px;
    color: #e0e0ff;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .activity-time {
    font-family: var(--font-family-base);
    font-size: 12px;
    color: #8080a0;
  }
}

.activity-tag {
  flex-shrink: 0;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 20px;
}

.tech-quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;
  background: rgba(10, 10, 26, 0.6);
  border: 1px solid rgba(0, 243, 255, 0.15);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-family-base);
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(0, 243, 255, 0.08);
    border-color: rgba(0, 243, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  .action-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: linear-gradient(135deg, #00f3ff 0%, #00c8d4 100%);
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
  }

  .action-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(0, 243, 255, 0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover .action-glow {
    opacity: 1;
  }

  .action-label {
    font-size: 13px;
    color: #e0e0ff;
    font-weight: 500;
    position: relative;
    z-index: 2;
  }
}

.popular-books-list {
  padding: 8px 0;
}

.popular-book-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  transition: background 0.2s ease;
  cursor: pointer;

  &:hover {
    background: rgba(0, 243, 255, 0.05);
  }
}

.book-rank {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: linear-gradient(135deg, #00f3ff 0%, #00c8d4 100%);
  color: #000;
  font-family: var(--font-family-base);
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 12px rgba(0, 243, 255, 0.3);

  .popular-book-item:nth-child(2) & {
    background: linear-gradient(135deg, #c0c0c0 0%, #a0a0a0 100%);
    box-shadow: 0 0 12px rgba(192, 192, 192, 0.3);
  }

  .popular-book-item:nth-child(3) & {
    background: linear-gradient(135deg, #cd9a6a 0%, #ad7a4a 100%);
    box-shadow: 0 0 12px rgba(205, 154, 106, 0.3);
  }

  .popular-book-item:nth-child(n+4) & {
    background: rgba(0, 243, 255, 0.15);
    color: #00f3ff;
    box-shadow: none;
  }
}

.book-cover {
  flex-shrink: 0;
}

.cover-placeholder {
  width: 44px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.book-info {
  flex: 1;
  min-width: 0;

  .book-title {
    font-family: var(--font-family-base);
    font-size: 14px;
    font-weight: 500;
    color: #e0e0ff;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .book-author {
    font-family: var(--font-family-base);
    font-size: 12px;
    color: #8080a0;
  }
}

.book-borrow-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-family-base);
  font-size: 13px;
  color: #8080a0;
  flex-shrink: 0;
}

// 动画类
.tech-fade-in-up {
  animation: tech-fade-in-up 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

@keyframes tech-fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

// Radio button styling
:deep(.el-radio-group) {
  .el-radio-button__inner {
    background: var(--color-surface);
    border: 1px solid var(--border-default);
    color: var(--text-muted);
    font-family: var(--font-family-base);

    &:hover {
      color: #00f3ff;
    }
  }

  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background: var(--color-info-soft);
    border-color: var(--color-primary);
    color: var(--color-primary);
    box-shadow: 0 0 12px rgba(0, 243, 255, 0.2);
  }
}

// 响应式
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

  .tech-quick-actions-card,
  .tech-popular-books-card {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .tech-home-page {
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
