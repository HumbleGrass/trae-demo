<template>
  <TechPageLayout :title="t('borrow.title')" subtitle="图书借阅与归还管理">
    <template #headerRight>
      <div class="stats-summary">
        <div class="stat-item">
          <div class="stat-icon stat-icon--borrowed">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ borrowedCount }}</span>
            <span class="stat-label">借阅中</span>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon stat-icon--overdue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value overdue">{{ overdueCount }}</span>
            <span class="stat-label">已逾期</span>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon stat-icon--returned">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value returned">{{ returnedCount }}</span>
            <span class="stat-label">已归还</span>
          </div>
        </div>
      </div>
      <TechButton :icon="Plus" @click="openBorrowDialog">新增借阅</TechButton>
    </template>

    <div class="search-section fade-in-up delay-1">
      <TechCard>
        <div class="search-form">
          <div class="search-input-group">
            <div class="tech-select-wrapper">
              <el-select
                v-model="searchForm.memberId"
                filterable
                clearable
                placeholder="选择会员"
                class="member-select tech-select"
              >
                <el-option
                  v-for="member in memberList"
                  :key="member.id"
                  :label="member.name"
                  :value="member.id"
                />
              </el-select>
              <span class="select-border"></span>
            </div>
            <div class="tech-select-wrapper">
              <el-select v-model="searchForm.status" clearable placeholder="借阅状态" size="default" class="status-select tech-select">
                <el-option label="全部" value="" />
                <el-option label="借阅中" value="borrowed" />
                <el-option label="已归还" value="returned" />
                <el-option label="已逾期" value="overdue" />
              </el-select>
              <span class="select-border"></span>
            </div>
          </div>
          <div class="search-actions">
            <TechButton :icon="Search" @click="handleSearch">{{ t('common.search') }}</TechButton>
            <TechButton variant="secondary" :icon="RefreshLeft" @click="handleReset">{{ t('common.reset') }}</TechButton>
          </div>
        </div>
      </TechCard>
    </div>

    <div class="table-section fade-in-up delay-2">
      <TechCard>
        <div class="table-header">
          <div class="table-title">
            <div class="title-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <span>借阅记录</span>
          </div>
          <div class="table-actions">
            <el-button link class="export-btn tech-link" size="default" @click="exportData">
              <el-icon><Download /></el-icon>
              导出
            </el-button>
          </div>
        </div>

        <div class="table-container">
          <el-table
            :data="tableData"
            v-loading="loading"
            class="custom-table tech-table"
            :row-class-name="tableRowClassName"
          >
            <el-table-column label="会员信息" min-width="160">
              <template #default="{ row }">
                <div class="member-info-cell">
                  <div class="member-avatar" :style="{ background: avatarGradient(row.member?.name) }">
                    <span class="avatar-text">{{ row.member?.name?.charAt(0) || 'U' }}</span>
                  </div>
                  <div class="member-details">
                    <div class="member-name">{{ row.member?.name || '-' }}</div>
                    <div class="member-phone code-text">{{ row.member?.phone || '-' }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="图书信息" min-width="220">
              <template #default="{ row }">
                <div class="book-info-cell">
                  <div class="book-cover-mini" :style="{ background: coverColor(row.book?.category) }">
                    <el-icon><Notebook /></el-icon>
                  </div>
                  <div class="book-details">
                    <div class="book-name">{{ row.book?.title || '-' }}</div>
                    <div class="book-author-meta">{{ row.book?.author || '-' }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="borrowDate" label="借阅日期" width="130">
              <template #default="{ row }">
                <span class="date-text code-text">{{ formatDate(row.borrowDate) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dueDate" label="应还日期" width="140">
              <template #default="{ row }">
                <div class="due-date-cell" :class="{ overdue: isOverdue(row) }">
                  <span class="date-text code-text">{{ formatDate(row.dueDate) }}</span>
                  <span v-if="isOverdue(row)" class="overdue-badge">
                    <span class="badge-icon">!</span>
                    逾期
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="t('borrow.status')" width="110">
              <template #default="{ row }">
                <StatusTag :status="row.status" type="borrow" />
              </template>
            </el-table-column>
            <el-table-column label="续借次数" width="100" align="center">
              <template #default="{ row }">
                <div class="renew-count">
                  <span class="count-icon">⟳</span>
                  <span class="count-value">{{ row.renewCount || 0 }}/1</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="t('borrow.borrowRecord')" width="180" fixed="right">
              <template #default="{ row }">
                <div class="action-buttons-group">
                  <TechButton
                    v-if="row.status === 'borrowed'"
                    size="small"
                    variant="success"
                    :icon="CircleCheck"
                    @click="handleReturn(row)"
                  >
                    归还
                  </TechButton>
                  <TechButton
                    v-if="row.status === 'borrowed' && !row.renewCount"
                    size="small"
                    variant="secondary"
                    :icon="Refresh"
                    @click="handleRenew(row)"
                  >
                    续借
                  </TechButton>
                  <TechButton
                    v-if="row.status === 'overdue'"
                    size="small"
                    variant="danger"
                    :icon="Warning"
                    @click="showOverdueInfo(row)"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="pagination-section">
          <div class="pagination-info">
            <span class="info-label">显示</span>
            <span class="info-value code-text">{{ pageInfo }}</span>
            <span class="info-label">条，共</span>
            <span class="info-value code-text">{{ pagination.total }}</span>
            <span class="info-label">条</span>
          </div>
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="prev, pager, next, sizes"
            @current-change="fetchData"
            @size-change="fetchData"
            class="custom-pagination tech-pagination"
          />
        </div>
      </TechCard>
    </div>

    <el-dialog
      v-model="borrowDialogVisible"
      :title="''"
      width="560px"
      :close-on-click-modal="false"
      class="borrow-dialog tech-dialog"
    >
      <div class="dialog-content">
        <div class="dialog-header">
          <div class="dialog-icon">
              <el-icon :size="28"><Reading /></el-icon>
            </div>
            <div class="dialog-title-section">
              <h3 class="dialog-title">新增借阅</h3>
              <p class="dialog-subtitle">为会员办理图书借阅</p>
            </div>
        </div>

        <el-form ref="borrowFormRef" :model="borrowForm" :rules="borrowRules" label-width="90px" class="borrow-form tech-form">
          <el-form-item label="会员" prop="memberId">
            <div class="tech-select-wrapper">
              <el-select
                v-model="borrowForm.memberId"
                filterable
                placeholder="请选择会员"
                style="width: 100%"
                class="form-select tech-select"
                @change="handleMemberChange"
              >
                <el-option
                  v-for="member in memberList"
                  :key="member.id"
                  :label="member.name"
                  :value="member.id"
                >
                  <div class="member-option">
                    <span class="member-option-name">{{ member.name }}</span>
                    <span class="member-option-phone code-text">{{ member.phone }}</span>
                  </div>
                </el-option>
              </el-select>
              <span class="select-border"></span>
            </div>
          </el-form-item>
          <el-form-item label="图书" prop="bookId">
            <div class="tech-select-wrapper">
              <el-select
                v-model="borrowForm.bookId"
                filterable
                placeholder="请选择图书"
                style="width: 100%"
                class="form-select tech-select"
              >
                <el-option
                  v-for="book in availableBooks"
                  :key="book.id"
                  :label="book.title"
                  :value="book.id"
                  :disabled="book.availableQuantity <= 0"
                >
                  <div class="book-option">
                    <span class="book-option-title">{{ book.title }}</span>
                    <span class="book-option-stock" :class="{ unavailable: book.availableQuantity <= 0 }">
                      库存: {{ book.availableQuantity }}
                    </span>
                  </div>
                </el-option>
              </el-select>
              <span class="select-border"></span>
            </div>
          </el-form-item>
          <el-form-item v-if="selectedMember" label="借阅信息">
            <div class="member-borrow-info">
              <div class="info-item">
                <span class="info-label">当前借阅:</span>
                <span class="info-value">{{ selectedMember.currentBorrows || 0 }} 本</span>
              </div>
              <div class="info-item">
                <span class="info-label">借阅上限:</span>
                <span class="info-value">{{ selectedMember.borrowLimit || 5 }} 本</span>
              </div>
            </div>
          </el-form-item>
        </el-form>

        <div class="dialog-footer">
          <TechButton variant="secondary" @click="borrowDialogVisible = false">{{ t('common.cancel') }}</TechButton>
          <TechButton :icon="Check" :loading="submitLoading" @click="handleBorrowSubmit">确认借阅</TechButton>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="returnDialogVisible"
      :title="''"
      width="460px"
      :close-on-click-modal="false"
      class="return-dialog tech-dialog"
    >
      <div class="dialog-content">
        <div class="dialog-header">
          <div class="dialog-icon success">
            <el-icon :size="28"><CircleCheck /></el-icon>
          </div>
          <div class="dialog-title-section">
            <h3 class="dialog-title">确认归还</h3>
            <p class="dialog-subtitle">确认归还以下图书</p>
          </div>
        </div>

        <div v-if="currentRecord" class="return-info">
          <div class="info-row">
            <span class="info-label">图书:</span>
            <span class="info-value">{{ currentRecord.book?.title }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">借阅人:</span>
            <span class="info-value">{{ currentRecord.member?.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">借阅日期:</span>
            <span class="info-value code-text">{{ formatDate(currentRecord.borrowDate) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">应还日期:</span>
            <span class="info-value" :class="{ overdue: isOverdue(currentRecord) }">
              {{ formatDate(currentRecord.dueDate) }}
            </span>
          </div>
          <div v-if="overdueInfo.days > 0" class="info-row overdue-info">
            <span class="info-label">逾期信息:</span>
            <span class="info-value danger">
              逾期 {{ overdueInfo.days }} 天，罚金 ¥{{ overdueInfo.fine.toFixed(2) }}
            </span>
          </div>
        </div>

        <div class="dialog-footer">
          <TechButton variant="secondary" @click="returnDialogVisible = false">{{ t('common.cancel') }}</TechButton>
          <TechButton variant="success" :icon="Check" :loading="submitLoading" @click="confirmReturn">确认归还</TechButton>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="renewDialogVisible"
      :title="''"
      width="460px"
      :close-on-click-modal="false"
      class="renew-dialog tech-dialog"
    >
      <div class="dialog-content">
        <div class="dialog-header">
          <div class="dialog-icon warning">
            <el-icon :size="28"><Refresh /></el-icon>
          </div>
          <div class="dialog-title-section">
            <h3 class="dialog-title">确认续借</h3>
            <p class="dialog-subtitle">延长借阅期限7天</p>
          </div>
        </div>

        <div v-if="currentRecord" class="renew-info">
          <div class="info-row">
            <span class="info-label">图书:</span>
            <span class="info-value">{{ currentRecord.book?.title }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">当前应还:</span>
            <span class="info-value code-text">{{ formatDate(currentRecord.dueDate) }}</span>
          </div>
          <div class="info-row highlight">
            <span class="info-label">续借后:</span>
            <span class="info-value">{{ getRenewDueDate(currentRecord.dueDate) }}</span>
          </div>
          <div class="renew-notice">
            <el-icon><InfoFilled /></el-icon>
            <span>每本书仅可续借1次</span>
          </div>
        </div>

        <div class="dialog-footer">
          <TechButton variant="secondary" @click="renewDialogVisible = false">{{ t('common.cancel') }}</TechButton>
          <TechButton variant="warning" :icon="Check" :loading="submitLoading" @click="confirmRenew">确认续借</TechButton>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="overdueDialogVisible"
      :title="''"
      width="460px"
      :close-on-click-modal="false"
      class="overdue-dialog tech-dialog"
    >
      <div class="dialog-content">
        <div class="dialog-header">
          <div class="dialog-icon danger">
            <el-icon :size="28"><Warning /></el-icon>
          </div>
          <div class="dialog-title-section">
            <h3 class="dialog-title">逾期罚金</h3>
            <p class="dialog-subtitle">逾期费用计算</p>
          </div>
        </div>

        <div v-if="currentRecord" class="overdue-info-detail">
          <div class="info-row">
            <span class="info-label">图书:</span>
            <span class="info-value">{{ currentRecord.book?.title }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">借阅人:</span>
            <span class="info-value">{{ currentRecord.member?.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">应还日期:</span>
            <span class="info-value code-text">{{ formatDate(currentRecord.dueDate) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">逾期天数:</span>
            <span class="info-value danger">{{ overdueInfo.days }} 天</span>
          </div>
          <div class="fine-summary">
            <div class="fine-row">
              <span class="fine-label">罚金标准</span>
              <span class="fine-value">¥0.50/天</span>
            </div>
            <div class="fine-row total">
              <span class="fine-label">应付罚金</span>
              <span class="fine-value">¥{{ overdueInfo.fine.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <TechButton variant="secondary" @click="overdueDialogVisible = false">关闭</TechButton>
        </div>
      </div>
    </el-dialog>
  </TechPageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import {
  Plus,
  Search,
  RefreshLeft,
  Download,
  Notebook,
  CircleCheck,
  Refresh,
  Warning,
  Reading,
  Check,
  InfoFilled
} from '@element-plus/icons-vue'
import { StatusTag } from '@/components/common'
import { getBorrows, createBorrow, returnBook, renewBook, calculateOverdue, type BorrowRecord } from '@/api/borrow'
import { getMembers } from '@/api/members'
import { getBooks } from '@/api/books'
import TechPageLayout from '@/components/layout/TechPageLayout.vue'
import TechCard from '@/components/common/TechCard.vue'
import TechButton from '@/components/common/TechButton.vue'
import { useTechTheme, usePagination, useSearchForm, useDateFormat } from '@/composables'

const route = useRoute()
const { t } = useI18n()
const { getCoverColor: coverColor, getAvatarGradient: avatarGradient } = useTechTheme()
const { formatDate, getRenewDueDate, isOverdue: checkIsOverdue } = useDateFormat()

const loading = ref(false)
const tableData = ref<BorrowRecord[]>([])
const memberList = ref<any[]>([])
const bookList = ref<any[]>([])
const submitLoading = ref(false)

const borrowDialogVisible = ref(false)
const returnDialogVisible = ref(false)
const renewDialogVisible = ref(false)
const overdueDialogVisible = ref(false)
const currentRecord = ref<BorrowRecord | null>(null)
const overdueInfo = ref({ days: 0, fine: 0 })

const { form: searchForm, reset: resetSearch, getCleanValues } = useSearchForm({
  memberId: undefined as number | undefined,
  status: ''
})

const { state: pagination, pageInfo, setTotal } = usePagination({
  pageSize: 20,
  pageSizes: [10, 20, 50, 100]
})

const borrowForm = reactive({
  memberId: undefined as number | undefined,
  bookId: undefined as number | undefined
})

const borrowFormRef = ref<FormInstance>()

const borrowRules: FormRules = {
  memberId: [{ required: true, message: '请选择会员', trigger: 'change' }],
  bookId: [{ required: true, message: '请选择图书', trigger: 'change' }]
}

const borrowedCount = computed(() => tableData.value.filter(r => r.status === 'borrowed').length)
const overdueCount = computed(() => tableData.value.filter(r => r.status === 'overdue').length)
const returnedCount = computed(() => tableData.value.filter(r => r.status === 'returned').length)

const availableBooks = computed(() => bookList.value.filter(b => b.availableQuantity > 0))

const selectedMember = computed(() => {
  if (!borrowForm.memberId) return null
  return memberList.value.find(m => m.id === borrowForm.memberId)
})

const isOverdue = (record: BorrowRecord) => {
  if (record.status === 'returned') return false
  return checkIsOverdue(record.dueDate)
}

const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...getCleanValues()
    }
    const res: any = await getBorrows(params)
    tableData.value = res.data || []
    setTotal(res.total || 0)
  } catch (error) {
    ElMessage.error('获取借阅记录失败')
  } finally {
    loading.value = false
  }
}

const fetchMembers = async () => {
  try {
    const res: any = await getMembers({ pageSize: 1000 })
    memberList.value = res.data || []
  } catch (error) {
    // silently ignore
  }
}

const fetchBooks = async () => {
  try {
    const res: any = await getBooks({ pageSize: 1000 })
    bookList.value = res.data?.data || res.data || []
  } catch (error) {
    // silently ignore
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  resetSearch()
  handleSearch()
}

const handleMemberChange = () => {
  borrowForm.bookId = undefined
}

const openBorrowDialog = () => {
  Object.assign(borrowForm, { memberId: undefined, bookId: undefined })
  borrowDialogVisible.value = true
}

const handleBorrowSubmit = async () => {
  if (!borrowFormRef.value) return
  await borrowFormRef.value.validate(async (valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      await createBorrow({
        bookId: borrowForm.bookId!,
        memberId: borrowForm.memberId!
      })
      ElMessage.success('借阅成功')
      borrowDialogVisible.value = false
      fetchData()
      fetchBooks()
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || '借阅失败')
    } finally {
      submitLoading.value = false
    }
  })
}

const handleReturn = async (row: BorrowRecord) => {
  currentRecord.value = row
  if (isOverdue(row)) {
    try {
      const res: any = await calculateOverdue(row.id)
      overdueInfo.value = res
    } catch (error) {
      overdueInfo.value = { days: 0, fine: 0 }
    }
  } else {
    overdueInfo.value = { days: 0, fine: 0 }
  }
  returnDialogVisible.value = true
}

const confirmReturn = async () => {
  if (!currentRecord.value) return
  submitLoading.value = true
  try {
    await returnBook(currentRecord.value.id)
    ElMessage.success('归还成功')
    returnDialogVisible.value = false
    fetchData()
    fetchBooks()
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '归还失败')
  } finally {
    submitLoading.value = false
  }
}

const handleRenew = (row: BorrowRecord) => {
  currentRecord.value = row
  renewDialogVisible.value = true
}

const confirmRenew = async () => {
  if (!currentRecord.value) return
  submitLoading.value = true
  try {
    await renewBook(currentRecord.value.id)
    ElMessage.success('续借成功，借阅期限已延长7天')
    renewDialogVisible.value = false
    fetchData()
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '续借失败')
  } finally {
    submitLoading.value = false
  }
}

const showOverdueInfo = async (row: BorrowRecord) => {
  currentRecord.value = row
  try {
    const res: any = await calculateOverdue(row.id)
    overdueInfo.value = res
  } catch (error) {
    overdueInfo.value = { days: 0, fine: 0 }
  }
  overdueDialogVisible.value = true
}

const exportData = () => {
  ElMessage.info('导出功能开发中')
}

onMounted(async () => {
  await fetchData()
  await fetchMembers()
  await fetchBooks()

  const bookId = route.query.bookId
  if (bookId) {
    borrowForm.bookId = Number(bookId)
    borrowDialogVisible.value = true
  }
})
</script>

<style lang="scss" scoped>
.search-section,
.table-section {
  margin-bottom: 24px;
}

.search-form,
.search-input-group,
.search-actions,
.table-header,
.action-buttons-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-form {
  justify-content: space-between;
}

.search-input-group {
  flex: 1;
  gap: 12px;
}

.table-header {
  justify-content: space-between;
  padding: 20px 28px;
  border-bottom: 1px solid var(--border-default);
  background: var(--color-surface);
}

.table-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-family-base);
  font-size: 18px;
  font-weight: 700;

  .title-icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    background: var(--color-info-soft);
    color: var(--color-primary);
    border: 1px solid var(--color-info-border);
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 20px;
      height: 20px;
    }
  }
}

.export-btn {
  font-family: var(--font-family-base);
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
}

.table-container {
  position: relative;
  overflow: hidden;
}

.member-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  transition: transform var(--transition-fast);

  .avatar-text {
    font-family: var(--font-family-base);
    font-size: 16px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
  }

  &:hover {
    transform: scale(1.05);
  }
}

.member-details {
  min-width: 0;

  .member-name {
    font-family: var(--font-family-base);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .member-phone {
    font-size: 12px;
    color: var(--text-muted);
  }
}

.book-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.book-cover-mini {
  width: 40px;
  height: 52px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.85);
  flex-shrink: 0;
  overflow: hidden;

  .el-icon {
    font-size: 18px;
  }
}

.book-details {
  min-width: 0;

  .book-name {
    font-family: var(--font-family-base);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .book-author-meta {
    font-family: var(--font-family-base);
    font-size: 12px;
    color: var(--text-muted);
  }
}

.date-text {
  font-size: 14px;
  color: var(--text-secondary);
}

.due-date-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  &.overdue {
    .date-text {
      color: var(--color-danger);
      font-weight: 600;
    }
  }

  .overdue-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    padding: 3px 8px;
    background: var(--color-danger-soft);
    color: var(--color-danger);
    border: 1px solid var(--color-danger-border);
    border-radius: var(--radius-sm);
    font-family: var(--font-family-base);
    font-weight: 600;
    text-transform: uppercase;

    .badge-icon {
      font-size: 12px;
      font-weight: 900;
    }
  }
}

.renew-count {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  .count-icon {
    color: var(--color-primary);
    font-size: 14px;
  }

  .count-value {
    font-family: var(--font-family-base);
    font-size: 14px;
    color: var(--text-secondary);
  }
}

.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  border-top: 1px solid var(--border-default);
  background: var(--color-surface);
}

.pagination-info {
  font-family: var(--font-family-base);
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;

  .info-label {
    color: var(--text-muted);
  }

  .info-value {
    color: var(--color-primary);
    margin: 0 4px;
  }
}

.member-option,
.book-option {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .member-option-name,
  .book-option-title {
    font-weight: 500;
    color: var(--text-primary);
  }

  .member-option-phone {
    color: var(--text-muted);
    font-size: 12px;
  }

  .book-option-stock {
    color: var(--color-success);
    font-size: 12px;
    font-family: var(--font-family-base);

    &.unavailable {
      color: var(--color-danger);
    }
  }
}

.member-borrow-info {
  display: flex;
  gap: 24px;
  padding: 16px 20px;
  background: var(--color-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);

  .info-item {
    display: flex;
    align-items: center;
    gap: 8px;

    .info-label {
      font-size: 13px;
      color: var(--text-muted);
      font-family: var(--font-family-base);
    }

    .info-value {
      font-size: 15px;
      font-weight: 600;
      color: var(--color-primary);
      font-family: var(--font-family-base);
    }
  }
}

.return-info,
.renew-info,
.overdue-info-detail {
  background: var(--color-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-default);

  &:last-child {
    border-bottom: none;
  }

  .info-label {
    font-family: var(--font-family-base);
    font-size: 13px;
    color: var(--text-muted);
  }

  .info-value {
    font-family: var(--font-family-base);
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);

    &.overdue,
    &.danger {
      color: var(--color-danger);
    }
  }

  &.highlight {
    background: var(--color-info-soft);
    margin: 12px -20px -12px;
    padding: 14px 20px;

    .info-value {
      color: var(--color-primary);
      font-family: var(--font-family-base);
    }
  }
}

.overdue-info {
  background: var(--color-danger-soft);
  margin: 12px -20px -20px;
  padding: 14px 20px;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
}

.renew-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px 16px;
  background: var(--color-warning-soft);
  border: 1px solid var(--color-warning-border);
  border-radius: var(--radius-md);
  color: var(--color-warning);
  font-size: 13px;
  font-family: var(--font-family-base);
}

.fine-summary {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--border-default);

  .fine-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;

    .fine-label {
      font-size: 14px;
      color: var(--text-muted);
      font-family: var(--font-family-base);
    }

    .fine-value {
      font-size: 14px;
      color: var(--text-primary);
      font-family: var(--font-family-base);
    }

    &.total {
      margin-top: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--border-default);

      .fine-label {
        font-weight: 500;
        color: var(--text-primary);
      }

      .fine-value {
        font-size: 20px;
        font-weight: 700;
        color: var(--color-danger);
      }
    }
  }
}

.dialog-footer {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}
</style>
