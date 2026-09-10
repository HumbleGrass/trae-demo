<template>
  <TechPageLayout :title="book.title || '图书详情'" subtitle="查看图书详细信息">
    <div class="book-detail-content fade-in-up" v-loading="loading">
      <div class="book-main-section fade-in-up delay-1">
        <TechCard>
          <div class="book-detail-grid">
            <!-- 图书封面 -->
            <div class="cover-section">
              <div class="book-cover-wrapper" :style="{ background: book.coverColor }">
                <div class="cover-glow"></div>
                <div class="cover-scanline"></div>
                <el-icon :size="80"><Notebook /></el-icon>
              </div>
              <div class="status-badge" :class="{ available: book.availableQuantity > 0 }">
                <span class="status-icon">{{ book.availableQuantity > 0 ? '◆' : '✕' }}</span>
                <span class="status-text">{{ book.availableQuantity > 0 ? '可借阅' : '已借完' }}</span>
              </div>
            </div>

            <!-- 图书信息 -->
            <div class="info-section">
              <h1 class="book-title neon-text">{{ book.title }}</h1>
              <p class="book-author">{{ book.author }} <span class="author-separator">//</span> {{ book.publisher || '未知出版社' }}</p>

              <div class="book-meta-grid">
                <div class="meta-item">
                  <span class="meta-label code-text">ISBN</span>
                  <span class="meta-value code-text">{{ book.isbn || '暂无' }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label code-text">出版日期</span>
                  <span class="meta-value code-text">{{ formatDate(book.publishDate) }}</span>
                </div>
                <div class="meta-item highlight">
                  <span class="meta-label code-text">库存数量</span>
                  <span class="meta-value code-text">{{ book.quantity }} 本</span>
                </div>
                <div class="meta-item success">
                  <span class="meta-label code-text">可借数量</span>
                  <span class="meta-value code-text available">{{ book.availableQuantity }} 本</span>
                </div>
              </div>

              <div class="description-section">
                <h3 class="section-title">
                  <span class="title-icon">▸</span>
                  图书简介
                  <span class="data-stream">▋</span>
                </h3>
                <p class="description-text">{{ book.description || '暂无简介' }}</p>
              </div>

              <div class="action-buttons">
                <TechButton 
                  :icon="Reading" 
                  size="large"
                  :disabled="book.availableQuantity === 0"
                  :loading="borrowLoading"
                  @click="handleBorrow"
                >
                  借阅此书
                </TechButton>
                <TechButton 
                  variant="secondary"
                  :icon="Bell"
                  size="large"
                  :disabled="book.availableQuantity > 0"
                  @click="handleReserve"
                >
                  预约此书
                </TechButton>
              </div>
            </div>
          </div>
        </TechCard>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-grid fade-in-up delay-2">
        <TechCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon view">
              <el-icon :size="24"><View /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value code-text">{{ book.borrowCount || 0 }}</div>
              <div class="stat-label">借阅次数</div>
            </div>
          </div>
        </TechCard>

        <TechCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon rating">
              <el-icon :size="24"><Star /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value code-text">{{ book.rating || '4.5' }}</div>
              <div class="stat-label">评分</div>
            </div>
          </div>
        </TechCard>

        <TechCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon borrowed">
              <el-icon :size="24"><Collection /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value code-text">{{ book.quantity - book.availableQuantity }}</div>
              <div class="stat-label">当前借出</div>
            </div>
          </div>
        </TechCard>
      </div>
    </div>
  </TechPageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Notebook, Reading, Bell, View, Star, Collection } from '@element-plus/icons-vue'
import { getBook } from '@/api/books'
import { createBorrow } from '@/api/borrow'
import { getMemberProfile } from '@/api/members'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'
import TechPageLayout from '@/components/layout/TechPageLayout.vue'
import TechCard from '@/components/common/TechCard.vue'
import TechButton from '@/components/common/TechButton.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

const loading = ref(false)
const borrowLoading = ref(false)
const book = ref<any>({
  id: 0,
  title: '',
  author: '',
  isbn: '',
  publisher: '',
  publishDate: null,
  quantity: 0,
  availableQuantity: 0,
  description: '',
  coverColor: 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)',
  borrowCount: 0,
  rating: '4.5'
})

const formatDate = (date: Date | string | null) => {
  if (!date) return '暂无'
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN')
}

const fetchBookDetail = async () => {
  const bookId = route.params.id
  if (!bookId) {
    ElMessage.error('图书ID不存在')
    router.back()
    return
  }
  
  loading.value = true
  try {
    const res = await getBook(Number(bookId))
    book.value = {
      ...res,
      coverColor: getCoverColor(res.id)
    }
  } catch (error) {
    ElMessage.error('获取图书详情失败')
    router.back()
  } finally {
    loading.value = false
  }
}

const getCoverColor = (id: number) => {
  const colors = [
    'linear-gradient(135deg, #00f5ff 0%, #0077b6 100%)',
    'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)',
    'linear-gradient(135deg, #ffbe0b 0%, #fb5607 100%)',
    'linear-gradient(135deg, #3a86ff 0%, #8ac926 100%)',
    'linear-gradient(135deg, #4a7a9a 0%, #6a9aba 100%)',
    'linear-gradient(135deg, #a85a5a 0%, #c87a7a 100%)'
  ]
  return colors[id % colors.length]
}

const handleBorrow = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  borrowLoading.value = true
  try {
    const member = await getMemberProfile() as any
    if (!member || !member.id) {
      ElMessage.warning('请先完善会员信息')
      router.push('/members')
      return
    }

    await createBorrow({
      bookId: book.value.id,
      memberId: member.id
    })
    ElMessage.success('借阅成功')
    notificationStore.triggerRefresh()
    router.push('/borrow')
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '借阅失败')
  } finally {
    borrowLoading.value = false
  }
}

const handleReserve = () => {
  router.push(`/reservations?bookId=${book.value.id}`)
}

onMounted(() => {
  fetchBookDetail()
})
</script>

<style lang="scss" scoped>
.book-detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.book-main-section {
  
}

.book-detail-grid {
  display: flex;
  gap: 40px;
  padding: 32px;
}

.cover-section {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.book-cover-wrapper {
  width: 220px;
  height: 300px;
  border-radius: var(--tech-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.95);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(0, 243, 255, 0.15);
  transition: all var(--tech-transition-base);

  &:hover {
    transform: scale(1.02) translateY(-4px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      0 0 30px rgba(0, 243, 255, 0.25);
  }
}

.cover-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity var(--tech-transition-base);

  .book-cover-wrapper:hover & {
    opacity: 1;
  }
}

.cover-scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(transparent, rgba(0, 243, 255, 0.4), transparent);
  animation: cover-scan 3s linear infinite;
}

@keyframes cover-scan {
  0% { transform: translateY(0); }
  100% { transform: translateY(297px); }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--tech-radius-full);
  font-family: var(--tech-font-mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  &.available {
    background: rgba(0, 255, 136, 0.15);
    color: var(--tech-neon-green);
    border: 1px solid var(--tech-neon-green);
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.2);
  }

  &:not(.available) {
    background: rgba(255, 51, 102, 0.15);
    color: var(--tech-neon-red);
    border: 1px solid var(--tech-neon-red);
    box-shadow: 0 0 15px rgba(255, 51, 102, 0.2);
    animation: pulse-red 2s ease-in-out infinite;
  }
}

@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 15px rgba(255, 51, 102, 0.2); }
  50% { box-shadow: 0 0 25px rgba(255, 51, 102, 0.4); }
}

.info-section {
  flex: 1;
  min-width: 0;
}

.book-title {
  font-family: var(--tech-font-display);
  font-size: 32px;
  font-weight: 700;
  color: var(--tech-text-primary);
  margin: 0 0 12px 0;
  letter-spacing: 1px;
}

.book-author {
  font-size: 16px;
  color: var(--tech-text-secondary);
  margin: 0 0 28px 0;
  font-family: var(--tech-font-body);

  .author-separator {
    margin: 0 8px;
    color: var(--tech-border-color);
  }
}

.book-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.meta-item {
  padding: 16px;
  background: var(--tech-bg-dark);
  border: 1px solid var(--tech-border-color);
  border-radius: var(--tech-radius-sm);
  transition: all var(--tech-transition-fast);

  &:hover {
    border-color: var(--tech-primary-400);
    box-shadow: 0 0 10px rgba(0, 243, 255, 0.1);
  }

  &.highlight:hover {
    border-color: var(--tech-neon-cyan);
  }

  &.success {
    border-color: rgba(0, 255, 136, 0.3);
    
    .meta-value.available {
      color: var(--tech-neon-green);
      text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
    }
  }
}

.meta-label {
  display: block;
  font-size: 11px;
  color: var(--tech-text-muted);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.meta-value {
  font-size: 15px;
  color: var(--tech-text-primary);
  font-weight: 500;

  &.available {
    color: var(--tech-neon-green);
    font-weight: 700;
  }
}

.description-section {
  margin-bottom: 28px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: var(--tech-text-primary);
  margin: 0 0 14px 0;
  font-family: var(--tech-font-display);

  .title-icon {
    color: var(--tech-neon-cyan);
    font-size: 14px;
  }
}

.description-text {
  font-size: 14px;
  color: var(--tech-text-secondary);
  line-height: 1.8;
  margin: 0;
  font-family: var(--tech-font-body);
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  transition: all var(--tech-transition-base);

  &:hover {
    transform: translateY(-4px);
    border-color: var(--tech-border-strong);
  }
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--tech-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  &.view {
    background: rgba(0, 245, 255, 0.1);
    color: var(--tech-neon-cyan);
    border: 1px solid var(--tech-neon-cyan);
    box-shadow: 0 0 15px rgba(0, 245, 255, 0.2);
  }

  &.rating {
    background: rgba(255, 190, 11, 0.1);
    color: var(--tech-neon-yellow);
    border: 1px solid var(--tech-neon-yellow);
    box-shadow: 0 0 15px rgba(255, 190, 11, 0.2);
  }

  &.borrowed {
    background: rgba(255, 0, 255, 0.1);
    color: var(--tech-neon-magenta);
    border: 1px solid var(--tech-neon-magenta);
    box-shadow: 0 0 15px rgba(255, 0, 255, 0.2);
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

.code-text {
  font-family: var(--tech-font-mono);
}

@media (max-width: 768px) {
  .book-detail-grid {
    flex-direction: column;
    align-items: center;
  }

  .book-meta-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
