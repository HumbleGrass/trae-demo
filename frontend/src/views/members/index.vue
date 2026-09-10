<template>
  <TechPageLayout :title="t('members.title')" subtitle="管理图书馆会员信息">
    <template #headerRight>
      <div class="stats-summary">
        <div class="stat-item">
          <div class="stat-icon stat-icon--total">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ tableData.length }}</span>
            <span class="stat-label">会员总数</span>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon stat-icon--active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value active">{{ activeCount }}</span>
            <span class="stat-label">活跃会员</span>
          </div>
        </div>
      </div>
    </template>

    <div class="search-section fade-in-up delay-1">
      <TechCard>
        <div class="search-form">
          <div class="search-input-group">
            <div class="tech-input-wrapper">
              <el-input
                v-model="searchForm.keyword"
                :placeholder="t('members.searchPlaceholder')"
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <span class="neon-text">会员列表</span>
            <span class="data-stream">▋</span>
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
            <el-table-column label="会员信息" min-width="200">
              <template #default="{ row }">
                <div class="member-info-cell">
                  <div class="member-avatar" :style="{ background: avatarGradient(row.name) }">
                    <div class="avatar-glow"></div>
                    <span class="avatar-text">{{ row.name?.charAt(0) || 'U' }}</span>
                  </div>
                  <div class="member-details">
                    <div class="member-name">{{ row.name }}</div>
                    <div class="member-phone code-text">{{ row.phone }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="idCard" :label="t('members.idCard')" width="200">
              <template #default="{ row }">
                <span class="id-card-text code-text">{{ row.idCard }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="email" :label="t('members.email')" min-width="200">
              <template #default="{ row }">
                <span class="email-text">{{ row.email || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="borrowLimit" :label="t('members.borrowLimit')" width="130">
              <template #default="{ row }">
                <div class="borrow-limit">
                  <span class="limit-icon">◈</span>
                  <span class="limit-value">{{ row.borrowLimit || 5 }}</span>
                  <span class="limit-unit">本</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="t('common.edit')" width="140" fixed="right">
              <template #default="{ row }">
                <TechButton size="small" :icon="Edit" @click="openEditDialog(row)">编辑</TechButton>
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
      class="member-dialog tech-dialog"
    >
      <div class="dialog-content">
        <div class="dialog-header">
          <div class="dialog-icon">
            <div class="icon-glow"></div>
            <el-icon :size="28"><User /></el-icon>
          </div>
          <div class="dialog-title-section">
            <h3 class="dialog-title neon-text">{{ t('members.editMember') }}</h3>
            <p class="dialog-subtitle">// 编辑会员信息</p>
          </div>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" label-width="90px" class="member-form tech-form">
          <el-form-item :label="t('members.name')" prop="name">
            <div class="tech-input-wrapper">
              <el-input v-model="form.name" placeholder="请输入姓名" size="default" class="form-input tech-input" />
              <span class="input-border"></span>
            </div>
          </el-form-item>
          <el-form-item :label="t('members.phone')" prop="phone">
            <div class="tech-input-wrapper">
              <el-input v-model="form.phone" placeholder="请输入手机号" size="default" class="form-input tech-input" />
              <span class="input-border"></span>
            </div>
          </el-form-item>
          <el-form-item :label="t('members.idCard')" prop="idCard">
            <div class="tech-input-wrapper">
              <el-input v-model="form.idCard" placeholder="请输入身份证号" size="default" class="form-input tech-input" />
              <span class="input-border"></span>
            </div>
          </el-form-item>
          <el-form-item :label="t('members.email')" prop="email">
            <div class="tech-input-wrapper">
              <el-input v-model="form.email" placeholder="请输入邮箱" size="default" class="form-input tech-input" />
              <span class="input-border"></span>
            </div>
          </el-form-item>
          <el-form-item :label="t('members.borrowLimit')" prop="borrowLimit">
            <div class="tech-input-wrapper">
              <el-input-number v-model="form.borrowLimit" :min="1" :max="20" size="default" style="width: 100%" class="form-input-number tech-input-number" />
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
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import {
  Search,
  RefreshLeft,
  Download,
  Edit,
  User,
  Check
} from '@element-plus/icons-vue'
import { getMembers, updateMember } from '@/api/members'
import TechPageLayout from '@/components/layout/TechPageLayout.vue'
import TechCard from '@/components/common/TechCard.vue'
import TechButton from '@/components/common/TechButton.vue'
import { useTechTheme, usePagination, useSearchForm } from '@/composables'

const { t } = useI18n()
const { getAvatarGradient: avatarGradient } = useTechTheme()

const loading = ref(false)
const tableData = ref<any[]>([])
const dialogVisible = ref(false)
const submitLoading = ref(false)
const currentId = ref<number>()

const { form: searchForm, reset: resetSearch, getCleanValues } = useSearchForm({
  keyword: ''
})

const { state: pagination, pageInfo, setTotal } = usePagination({
  pageSize: 20,
  pageSizes: [10, 20, 50, 100]
})

const form = reactive({
  name: '',
  phone: '',
  idCard: '',
  email: '',
  borrowLimit: 5
})

const formRef = ref<FormInstance>()

const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }]
}

const activeCount = computed(() => {
  return tableData.value.filter(m => m.borrowLimit >= 5).length
})

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
    const res: any = await getMembers(params)
    tableData.value = res.data?.data || res.data || []
    setTotal(res.data?.total || 0)
  } catch (error) {
    ElMessage.error('获取会员列表失败')
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

const openEditDialog = (row: any) => {
  currentId.value = row.id
  Object.assign(form, {
    name: row.name,
    phone: row.phone,
    idCard: row.idCard,
    email: row.email || '',
    borrowLimit: row.borrowLimit || 5
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      await updateMember(currentId.value!, form)
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

onMounted(() => {
  fetchData()
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
.table-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-form {
  justify-content: space-between;
}

.search-input-group {
  flex: 1;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.table-header {
  justify-content: space-between;
  padding: 20px 28px;
  border-bottom: 1px solid var(--tech-border-color);
  background: var(--tech-bg-dark);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--tech-neon-cyan), transparent);
  }
}

.table-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--tech-font-cyber);
  font-size: 18px;
  font-weight: 700;

  .title-icon {
    width: 40px;
    height: 40px;
    border-radius: 2px;
    background: rgba(0, 245, 255, 0.1);
    color: var(--tech-neon-cyan);
    border: 1px solid var(--tech-neon-cyan);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(0, 245, 255, 0.2);

    svg {
      width: 20px;
      height: 20px;
    }
  }
}

.export-btn {
  font-family: var(--tech-font-mono);
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 2px;
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
  width: 44px;
  height: 44px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  transition: all var(--tech-transition-fast);

  .avatar-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  }

  .avatar-text {
    font-family: var(--tech-font-cyber);
    font-size: 18px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
    z-index: 1;
  }

  &:hover {
    transform: scale(1.05);
  }
}

.member-details {
  min-width: 0;

  .member-name {
    font-family: var(--tech-font-body);
    font-size: 15px;
    font-weight: 600;
    color: var(--tech-text-primary);
    margin-bottom: 4px;
  }

  .member-phone {
    font-size: 12px;
    color: var(--tech-text-muted);
  }
}

.id-card-text {
  font-size: 13px;
  color: var(--tech-text-secondary);
}

.email-text {
  font-family: var(--tech-font-body);
  font-size: 14px;
  color: var(--tech-text-secondary);
}

.borrow-limit {
  display: flex;
  align-items: center;
  gap: 6px;

  .limit-icon {
    color: var(--tech-neon-cyan);
    font-size: 12px;
  }

  .limit-value {
    font-family: var(--tech-font-cyber);
    font-size: 18px;
    font-weight: 700;
    color: var(--tech-neon-cyan);
  }

  .limit-unit {
    font-family: var(--tech-font-mono);
    font-size: 12px;
    color: var(--tech-text-muted);
  }
}

.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  border-top: 1px solid var(--tech-border-color);
  background: var(--tech-bg-dark);
}

.pagination-info {
  font-family: var(--tech-font-mono);
  font-size: 13px;
  color: var(--tech-text-muted);
  font-weight: 500;

  .info-label {
    color: var(--tech-text-muted);
  }

  .info-value {
    color: var(--tech-neon-cyan);
    margin: 0 4px;
  }
}
</style>
