<template>
  <TechPageLayout title="预约管理" subtitle="管理图书预约请求">
    <div class="reservations-content fade-in-up">
      <!-- 统计摘要 -->
      <div class="stats-summary fade-in-up delay-1">
        <TechCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total">
              <el-icon :size="24"><List /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value code-text">{{ stats.total }}</div>
              <div class="stat-label">总预约数</div>
            </div>
          </div>
        </TechCard>

        <TechCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon pending">
              <el-icon :size="24"><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value code-text">{{ stats.pending }}</div>
              <div class="stat-label">待处理</div>
            </div>
          </div>
        </TechCard>

        <TechCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon active">
              <el-icon :size="24"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value code-text">{{ stats.active }}</div>
              <div class="stat-label">进行中</div>
            </div>
          </div>
        </TechCard>

        <TechCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon completed">
              <el-icon :size="24"><Select /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value code-text">{{ stats.completed }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </TechCard>
      </div>

      <!-- 搜索表单 -->
      <SearchForm
        :fields="searchFields"
        @search="handleSearch"
        @reset="handleReset"
        class="fade-in-up delay-2"
      />

      <!-- 数据表格 -->
      <TechCard class="table-section fade-in-up delay-3">
        <template #header>
          <div class="table-header">
            <h3 class="table-title">预约记录</h3>
            <span class="data-count code-text">{{ pagination.total }} 条记录</span>
          </div>
        </template>

        <el-table 
          v-loading="loading"
          :data="reservations" 
          stripe 
          class="tech-table"
          empty-text="暂无预约数据"
        >
          <el-table-column prop="id" label="#" width="60" align="center">
            <template #default="{ row }">
              <span class="code-text id-cell">#{{ row.id }}</span>
            </template>
          </el-table-column>

          <el-table-column label="图书信息" min-width="200">
            <template #default="{ row }">
              <div class="book-info">
                <span class="book-name">{{ row.book?.title || '未知' }}</span>
                <span class="book-isbn code-text">{{ row.book?.isbn || '-' }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="会员信息" width="150">
            <template #default="{ row }">
              <div class="member-info">
                <span class="member-name">{{ row.member?.name || '未知' }}</span>
                <span class="member-phone code-text">{{ row.member?.phone || '-' }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="预约日期" width="120" align="center">
            <template #default="{ row }">
              <span class="code-text date-cell">{{ formatDate(row.createdAt) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <StatusTag :status="row.status" />
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <TechButton 
                  variant="ghost" 
                  size="small"
                  :icon="View"
                  @click="viewDetail(row)"
                >
                  查看
                </TechButton>
                <TechButton 
                  v-if="row.status === 'pending'"
                  variant="danger" 
                  size="small"
                  :icon="Delete"
                  @click="cancelReservation(row)"
                >
                  取消
                </TechButton>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <Pagination
          :total="pagination.total"
          :page="pagination.page"
          :limit="pagination.limit"
          @pagination="handlePagination"
        />
      </TechCard>
    </div>
  </TechPageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { List, Clock, CircleCheck, Select, View, Delete } from '@element-plus/icons-vue'
import { getReservations, cancelReservation as apiCancelReservation, getAllReservations } from '@/api/reservations'
import SearchForm from '@/components/SearchForm/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import StatusTag from '@/components/common/StatusTag.vue'
import TechPageLayout from '@/components/layout/TechPageLayout.vue'
import TechCard from '@/components/common/TechCard.vue'
import TechButton from '@/components/common/TechButton.vue'

const loading = ref(false)
const reservations = ref<any[]>([])
const searchParams = reactive<Record<string, any>>({})

const searchFields = [
  { prop: 'status', label: '预约状态', type: 'select' as const, placeholder: '选择状态', options: [
    { label: '待处理', value: 'pending' },
    { label: '已完成', value: 'fulfilled' },
    { label: '已取消', value: 'cancelled' }
  ]},
  { prop: 'keyword', label: '搜索关键词', type: 'input' as const, placeholder: '搜索书名或会员名' }
]

const stats = computed(() => ({
  total: reservations.value.length,
  pending: reservations.value.filter(r => r.status === 'pending').length,
  active: reservations.value.filter(r => ['pending', 'fulfilled'].includes(r.status)).length,
  completed: reservations.value.filter(r => r.status === 'fulfilled').length
}))

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

const fetchReservations = async () => {
  loading.value = true
  try {
    const res = await getAllReservations({
      ...searchParams,
      page: pagination.page,
      pageSize: pagination.limit
    })
    if (Array.isArray(res)) {
      reservations.value = res
      pagination.total = res.length
    } else {
      reservations.value = res.data || []
      pagination.total = res.total || 0
    }
  } catch (error) {
    ElMessage.error('获取预约列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = (params: Record<string, any>) => {
  Object.assign(searchParams, params)
  pagination.page = 1
  fetchReservations()
}

const handleReset = () => {
  Object.keys(searchParams).forEach(key => delete searchParams[key])
  pagination.page = 1
  fetchReservations()
}

const handlePagination = (payload: { page: number; limit: number }) => {
  pagination.page = payload.page
  pagination.limit = payload.limit
  fetchReservations()
}

const viewDetail = (row: any) => {
  ElMessage.info(`查看预约 #${row.id} 详情`)
}

const cancelReservation = (row: any) => {
  ElMessageBox.confirm(
    `确定要取消预约 "${row.book?.title}" 吗？`,
    '确认取消',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await apiCancelReservation(row.id)
      ElMessage.success('预约已取消')
      fetchReservations()
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || '取消失败')
    }
  }).catch(() => {})
}

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN')
}

onMounted(() => {
  fetchReservations()
})
</script>

<style lang="scss" scoped>
.reservations-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-summary {
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
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.total {
        background: var(--color-info-soft);
        color: var(--color-primary);
        border: 1px solid var(--color-info-border);
      }

      &.pending {
        background: var(--color-warning-soft);
        color: var(--color-warning);
        border: 1px solid var(--color-warning-border);
      }

      &.active {
        background: var(--color-success-soft);
        color: var(--color-success);
        border: 1px solid var(--color-success-border);
      }

      &.completed {
        background: rgba(26, 127, 55, 0.08);
        color: #1a7f37;
        border: 1px solid rgba(26, 127, 55, 0.25);
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

.table-section {
  
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .table-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  .data-count {
    font-size: 12px;
    color: var(--text-muted);
  }
}

.tech-table {
  --el-table-bg-color: var(--color-surface);
  --el-table-tr-bg-color: var(--color-surface);
  --el-table-header-bg-color: var(--color-canvas-soft);
  --el-table-row-hover-bg-color: var(--color-canvas-soft);
  --el-table-border-color: var(--border-default);
  --el-table-text-color: var(--text-secondary);
  --el-table-header-text-color: var(--text-muted);

  :deep(th.el-table__cell) {
    background: var(--el-table-header-bg-color);
    font-family: var(--font-family-base);
    font-size: var(--font-size-eyebrow);
    font-weight: var(--font-weight-title);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
    border-bottom: 2px solid var(--border-default);

    .cell {
      padding: 16px 12px;
    }
  }

  :deep(td.el-table__cell) {
    border-bottom: 1px solid var(--border-default);

    .cell {
      padding: 14px 12px;
      font-size: 14px;
    }
  }

  :deep(.el-table__empty-block) {
    background: var(--color-surface);
  }

  :deep(.el-table__inner-wrapper::before) {
    background: var(--border-default);
  }
}

.id-cell {
  color: var(--color-primary);
  font-weight: 700;
}

.book-info {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .book-name {
    font-weight: 500;
    color: var(--text-primary);
  }

  .book-isbn {
    font-size: 11px;
    color: var(--text-muted);
  }
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .member-name {
    font-weight: 500;
    color: var(--text-primary);
  }

  .member-phone {
    font-size: 11px;
    color: var(--text-muted);
  }
}

.date-cell {
  color: var(--text-secondary);
  font-size: 13px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.code-text {
  font-family: var(--font-family-base);
}

@media (max-width: 1024px) {
  .stats-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-summary {
    grid-template-columns: 1fr;
  }
}
</style>
