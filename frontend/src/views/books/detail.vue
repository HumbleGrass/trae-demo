<template>
  <TechPageLayout :title="book.title || '图书详情'" subtitle="查看图书详细信息">
    <div class="book-detail-content fade-in-up" v-loading="loading">
      <div class="book-main-section fade-in-up delay-1">
        <TechCard>
          <div class="book-detail-grid">
            <!-- 图书封面 -->
            <div class="cover-section">
              <div class="book-cover-wrapper" :style="{ background: book.coverColor }">
                <el-icon :size="80"><Notebook /></el-icon>
              </div>
              <div class="status-badge" :class="{ available: book.availableQuantity > 0 }">
                <span class="status-icon">{{ book.availableQuantity > 0 ? '●' : '✕' }}</span>
                <span class="status-text">{{ book.availableQuantity > 0 ? '可借阅' : '已借完' }}</span>
              </div>
            </div>

            <!-- 图书信息 -->
            <div class="info-section">
              <h1 class="book-title">{{ book.title }}</h1>
              <p class="book-author">{{ book.author }} <span class="author-separator">·</span> {{ book.publisher || '未知出版社' }}</p>

              <div class="book-meta-grid">
                <div class="meta-item">
                  <span class="meta-label">ISBN</span>
                  <span class="meta-value">{{ book.isbn || '暂无' }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">出版日期</span>
                  <span class="meta-value">{{ formatDate(book.publishDate) }}</span>
                </div>
                <div class="meta-item highlight">
                  <span class="meta-label">库存数量</span>
                  <span class="meta-value">{{ book.quantity }} 本</span>
                </div>
                <div class="meta-item success">
                  <span class="meta-label">可借数量</span>
                  <span class="meta-value available">{{ book.availableQuantity }} 本</span>
                </div>
              </div>

              <div class="description-section">
                <h3 class="section-title">图书简介</h3>
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
              <div class="stat-value">{{ book.borrowCount || 0 }}</div>
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
              <div class="stat-value">{{ book.rating || '4.5' }}</div>
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
              <div class="stat-value">{{ book.quantity - book.availableQuantity }}</div>
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
    'linear-gradient(135deg, #0077b6 0%, #023e8a 100%)',
    'linear-gradient(135deg, #6a4c93 0%, #391c57 100%)',
    'linear-gradient(135deg, #e9c46a 0%, #f4a261 100%)',
    'linear-gradient(135deg, #3a86ff 0%, #52b788 100%)',
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
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.95);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: all var(--transition-base);

  &:hover {
    transform: scale(1.02) translateY(-4px);
    box-shadow: var(--shadow-elevated);
  }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-family: var(--font-family-base);
  font-size: 12px;
  font-weight: 600;

  &.available {
    background: var(--color-success-soft);
    color: var(--color-success);
    border: 1px solid var(--color-success-border);
  }

  &:not(.available) {
    background: var(--color-danger-soft);
    color: var(--color-danger);
    border: 1px solid var(--color-danger-border);
  }
}

.info-section {
  flex: 1;
  min-width: 0;
}

.book-title {
  font-family: var(--font-family-base);
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.book-author {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0 0 28px 0;

  .author-separator {
    margin: 0 8px;
    color: var(--text-muted);
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
  background: var(--color-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  transition: border-color var(--transition-fast);

  &:hover {
    border-color: var(--color-primary);
  }

  &.success {
    border-color: var(--color-success-border);
    
    .meta-value.available {
      color: var(--color-success);
      font-weight: 700;
    }
  }
}

.meta-label {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.meta-value {
  font-size: 15px;
  color: var(--text-primary);
  font-weight: 500;

  &.available {
    font-weight: 700;
  }
}

.description-section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 14px 0;
  font-family: var(--font-family-base);
}

.description-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin: 0;
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
  transition: all var(--transition-base);

  &:hover {
    transform: translateY(-4px);
    border-color: var(--border-default);
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
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  &.view {
    background: var(--color-info-soft);
    color: var(--color-info);
  }

  &.rating {
    background: var(--color-warning-soft);
    color: var(--color-warning);
  }

  &.borrowed {
    background: var(--color-danger-soft);
    color: var(--color-danger);
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
  }
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
