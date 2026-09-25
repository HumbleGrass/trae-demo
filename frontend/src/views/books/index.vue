<template>
  <TechPageLayout :title="t('books.title')" subtitle="管理和维护图书馆藏书资源">
    <template #headerRight>
      <div class="stats-summary">
        <div class="stat-item">
          <div class="stat-icon stat-icon--total">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ tableData.length }}</span>
            <span class="stat-label">图书总数</span>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon stat-icon--available">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value available">{{ availableCount }}</span>
            <span class="stat-label">可借</span>
          </div>
        </div>
      </div>
      <TechButton :icon="Plus" @click="openAddDialog">{{ t('books.addBook') }}</TechButton>
    </template>

    <div class="search-section fade-in-up delay-1">
      <TechCard>
        <div class="search-form">
          <div class="search-input-group">
            <div class="tech-input-wrapper">
              <el-input
                v-model="searchForm.keyword"
                :placeholder="t('books.searchPlaceholder')"
                clearable
                size="default"
                class="search-input tech-input"
                @keyup.enter="handleSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <span class="input-border"></span>
            </div>
            <div class="tech-select-wrapper">
              <el-select v-model="searchForm.category" clearable placeholder="分类" size="default" class="category-select tech-select">
                <el-option label="全部" value="" />
                <el-option label="文学" value="文学" />
                <el-option label="科技" value="科技" />
                <el-option label="历史" value="历史" />
                <el-option label="儿童" value="儿童" />
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
            <span>图书列表</span>
          </div>
          <div class="table-actions">
            <el-button link class="export-btn tech-link" size="default">
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
            <el-table-column prop="isbn" :label="t('books.isbn')" width="160">
              <template #default="{ row }">
                <span class="isbn-text code-text">{{ row.isbn }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="图书" min-width="240">
              <template #default="{ row }">
                <div class="book-info-cell">
                  <div class="book-cover-mini" :style="{ background: coverColor(row.category) }">
                    <el-icon><Notebook /></el-icon>
                  </div>
                  <div class="book-details">
                    <div class="book-name">{{ row.title }}</div>
                    <div class="book-author-meta">{{ row.author }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="category" :label="t('books.category')" width="110">
              <template #default="{ row }">
                <el-tag size="small" class="category-tag tech-tag" :type="getCategoryType(row.category)">
                  {{ row.category }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="availableQuantity" :label="t('books.available')" width="120">
              <template #default="{ row }">
                <div class="stock-status">
                  <span class="stock-dot" :class="{ available: row.availableQuantity > 0 }"></span>
                  <span class="stock-text" :class="{ available: row.availableQuantity > 0 }">
                    {{ row.availableQuantity }} 本
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="t('common.edit')" width="160" fixed="right">
              <template #default="{ row }">
                <div class="action-buttons-group">
                  <TechButton size="small" :icon="Edit" @click="openEditDialog(row)">编辑</TechButton>
                  <TechButton variant="danger" :icon="Delete" @click="handleDelete(row)" />
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
      v-model="dialogVisible"
      :title="''"
      width="560px"
      :close-on-click-modal="false"
      class="book-dialog tech-dialog"
    >
      <div class="dialog-content">
        <div class="dialog-header">
          <div class="dialog-icon">
            <el-icon :size="28">
              <Notebook v-if="!isEdit" />
              <Edit v-else />
            </el-icon>
          </div>
          <div class="dialog-title-section">
            <h3 class="dialog-title">{{ isEdit ? t('books.editBook') : t('books.addBook') }}</h3>
            <p class="dialog-subtitle">{{ isEdit ? '编辑图书信息' : '添加新图书到馆藏' }}</p>
          </div>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" label-width="90px" class="book-form tech-form">
          <el-form-item :label="t('books.isbn')" prop="isbn">
            <div class="tech-input-wrapper">
              <el-input v-model="form.isbn" placeholder="请输入ISBN编号" size="default" class="form-input tech-input" />
              <span class="input-border"></span>
            </div>
          </el-form-item>
          <el-form-item :label="t('books.bookName')" prop="title">
            <div class="tech-input-wrapper">
              <el-input v-model="form.title" placeholder="请输入书名" size="default" class="form-input tech-input" />
              <span class="input-border"></span>
            </div>
          </el-form-item>
          <el-form-item :label="t('books.author')" prop="author">
            <div class="tech-input-wrapper">
              <el-input v-model="form.author" placeholder="请输入作者" size="default" class="form-input tech-input" />
              <span class="input-border"></span>
            </div>
          </el-form-item>
          <el-form-item :label="t('books.category')" prop="category">
            <div class="tech-select-wrapper">
              <el-select v-model="form.category" placeholder="请选择分类" size="default" style="width: 100%" class="form-select tech-select">
                <el-option label="文学" value="文学" />
                <el-option label="科技" value="科技" />
                <el-option label="历史" value="历史" />
                <el-option label="儿童" value="儿童" />
              </el-select>
              <span class="select-border"></span>
            </div>
          </el-form-item>
          <el-form-item :label="t('books.stock')" prop="stock">
            <div class="tech-input-wrapper">
              <el-input-number v-model="form.stock" :min="0" :max="9999" size="default" style="width: 100%" class="form-input-number tech-input-number" />
              <span class="input-border"></span>
            </div>
          </el-form-item>
        </el-form>

        <div class="dialog-footer">
          <TechButton variant="secondary" @click="dialogVisible = false">{{ t('common.cancel') }}</TechButton>
          <TechButton :icon="Check" :loading="submitLoading" @click="handleSubmit">{{ t('common.save') }}</TechButton>
        </div>
      </div>
    </el-dialog>
  </TechPageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, FormInstance, FormRules, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  RefreshLeft,
  Download,
  Edit,
  Delete,
  Notebook,
  Check
} from '@element-plus/icons-vue'
import { getBooks, createBook, updateBook, deleteBook } from '@/api/books'
import TechPageLayout from '@/components/layout/TechPageLayout.vue'
import TechCard from '@/components/common/TechCard.vue'
import TechButton from '@/components/common/TechButton.vue'
import { useTechTheme, usePagination, useSearchForm } from '@/composables'

const { t } = useI18n()
const { getCoverColor: coverColor } = useTechTheme()

const loading = ref(false)
const tableData = ref<any[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const currentId = ref<number>()

const { form: searchForm, reset: resetSearch, getCleanValues } = useSearchForm({
  keyword: '',
  category: ''
})

const { state: pagination, pageInfo, setTotal } = usePagination({
  pageSize: 20,
  pageSizes: [10, 20, 50, 100]
})

const form = reactive({
  isbn: '',
  title: '',
  author: '',
  category: '',
  stock: 0
})

const formRef = ref<FormInstance>()

const rules: FormRules = {
  isbn: [{ required: true, message: '请输入ISBN', trigger: 'blur' }],
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }]
}

const availableCount = computed(() => {
  return tableData.value.reduce((sum, book) => sum + (book.availableQuantity || 0), 0)
})

const getCategoryType = (category: string) => {
  const types: Record<string, any> = {
    '文学': '',
    '科技': 'info',
    '历史': 'success',
    '儿童': 'warning'
  }
  return types[category] || ''
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
    const res: any = await getBooks(params)
    // 兼容历史包裹形状（{ data: { data: [], total } }）与当前裸形状（{ data: [], total }）
    tableData.value = res.data?.data || res.data || []
    setTotal(res.total || 0)
  } catch (error) {
    ElMessage.error('获取图书列表失败')
  } finally {
    loading.value = false
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

const openAddDialog = () => {
  isEdit.value = false
  Object.assign(form, { isbn: '', title: '', author: '', category: '', stock: 0 })
  dialogVisible.value = true
}

const openEditDialog = (row: any) => {
  isEdit.value = true
  currentId.value = row.id
  Object.assign(form, { ...row, stock: row.quantity })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      const data = {
        isbn: form.isbn,
        title: form.title,
        author: form.author,
        category: form.category,
        quantity: form.stock
      }
      if (isEdit.value && currentId.value) {
        await updateBook(currentId.value, data)
      } else {
        await createBook(data)
      }
      ElMessage.success(t('common.success'))
      dialogVisible.value = false
      fetchData()
    } catch (error: any) {
      ElMessage.error(error.message || t('common.failed'))
    } finally {
      submitLoading.value = false
    }
  })
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除图书《${row.title}》吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-btn',
        cancelButtonClass: 'cancel-btn'
      }
    )
    await deleteBook(row.id)
    ElMessage.success(t('common.success'))
    fetchData()
  } catch {
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
// Page-specific layout; shared visual rules come from the Notion token layer.
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
  gap: 16px;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.category-select {
  width: 160px;
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
  font-weight: var(--font-weight-heading);

  .title-icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-sm);
    background: var(--color-canvas-soft);
    color: var(--color-primary);
    border: 1px solid var(--border-default);
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
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-body);
  padding: 8px 16px;
  border-radius: var(--radius-sm);
}

.table-container {
  position: relative;
  overflow: hidden;
}

.book-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.book-cover-mini {
  width: 44px;
  height: 56px;
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.95);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);

  .el-icon {
    font-size: 20px;
    z-index: 1;
  }

  &:hover {
    transform: scale(1.05) translateY(-2px);
    box-shadow: var(--shadow-soft);
  }
}

.book-details {
  min-width: 0;

  .book-name {
    font-family: var(--font-family-base);
    font-size: var(--font-size-body-md);
    font-weight: var(--font-weight-title);
    color: var(--text-primary);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .book-author-meta {
    font-family: var(--font-family-base);
    font-size: var(--font-size-caption);
    color: var(--text-muted);
  }
}

.isbn-text {
  font-family: var(--font-family-base);
  font-size: var(--font-size-body-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-body);
}

.category-tag {
  font-family: var(--font-family-base);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-button);
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  background: var(--color-info-soft);
  border: 1px solid var(--color-info-border);
  color: var(--color-primary);
}

.stock-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stock-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  background: var(--color-danger);
  transition: background-color var(--transition-fast);

  &.available {
    background: var(--color-success);
  }
}

.stock-text {
  font-family: var(--font-family-base);
  font-size: var(--font-size-body-md);
  color: var(--text-secondary);
  font-weight: var(--font-weight-body);

  &.available {
    color: var(--color-success);
    font-weight: var(--font-weight-title);
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
  font-size: var(--font-size-body-sm);
  color: var(--text-muted);
  font-weight: var(--font-weight-body);

  .info-label {
    color: var(--text-muted);
  }

  .info-value {
    color: var(--text-primary);
    font-weight: var(--font-weight-title);
    margin: 0 4px;
  }
}
</style>
