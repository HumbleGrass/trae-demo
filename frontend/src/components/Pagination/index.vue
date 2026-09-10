<template>
  <div class="tech-pagination-container">
    <div class="pagination-info" v-if="showTotal">
      <span class="info-label">显示</span>
      <span class="info-value code-text">{{ start }}-{{ end }}</span>
      <span class="info-label">条，共</span>
      <span class="info-value code-text">{{ total }}</span>
      <span class="info-label">条</span>
    </div>
    
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      layout="prev, pager, next, sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="tech-pagination"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  total: number
  page?: number
  limit?: number
  showTotal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  limit: 10,
  showTotal: true
})

const emit = defineEmits<{
  (e: 'pagination', payload: { page: number; limit: number }): void
}>()

const currentPage = computed({
  get: () => props.page,
  set: (val) => emit('pagination', { page: val, limit: props.limit })
})

const pageSize = computed({
  get: () => props.limit,
  set: (val) => emit('pagination', { page: props.page, limit: val })
})

const start = computed(() => {
  if (props.total === 0) return 0
  return (props.page - 1) * props.limit + 1
})

const end = computed(() => {
  return Math.min(props.page * props.limit, props.total)
})

function handleSizeChange(val: number) {
  emit('pagination', { page: props.page, limit: val })
}

function handleCurrentChange(val: number) {
  emit('pagination', { page: val, limit: props.limit })
}
</script>

<style scoped lang="scss">
@media not all {
.tech-pagination-container {
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
    font-weight: 600;
  }
}

.tech-pagination {
  :deep(.el-pager li) {
    font-family: var(--font-family-base);
    font-weight: 500;
    border-radius: 2px !important;
    margin: 0 2px;
    background: var(--color-surface);
    color: var(--text-secondary);
    border: 1px solid var(--border-default);
    min-width: 32px !important;
    height: 32px !important;
    line-height: 30px !important;
    transition: all var(--transition-fast);
    
    &:hover {
      color: var(--color-primary) !important;
      border-color: var(--color-primary) !important;
    }
  }
  
  :deep(.btn-prev),
  :deep(.btn-next) {
    border-radius: 2px !important;
    background: var(--color-surface);
    border: 1px solid var(--border-default);
    color: var(--text-secondary);
    min-width: 32px !important;
    height: 32px !important;
    transition: all var(--transition-fast);
    
    &:hover {
      color: var(--color-primary) !important;
      border-color: var(--color-primary) !important;
    }
  }
  
  :deep(.is-active) {
    color: var(--color-primary) !important;
    border-color: var(--color-primary) !important;
    font-weight: 700;
  }
  
  :deep(.el-select) {
    margin-left: 8px;

    .el-select__wrapper {
      border-radius: 2px !important;
      height: 32px !important;
      min-height: 32px !important;
      transition: all 0.25s ease !important;

      &:hover {
        border-color: var(--color-primary) !important;
      }
    }

    .el-select__placeholder {
      color: var(--text-secondary) !important;
      font-family: var(--font-family-base);
      font-size: 13px !important;
    }

    .el-select__caret,
    .el-select__icon {
      color: var(--color-primary) !important;
    }

    &.is-focused .el-select__wrapper {
      border-color: var(--color-primary) !important;
    }
  }
}

.code-text {
  font-family: var(--font-family-base);
}
}
</style>

<style scoped lang="scss">
.tech-pagination-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: var(--surface-panel);
  border-top: 1px solid var(--border-default);
}

.pagination-info {
  flex: 0 0 auto;
  color: var(--text-muted);
  font-family: var(--font-family-base);
  font-size: var(--font-size-caption);
}

.info-value {
  margin: 0 var(--space-xxs);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  font-weight: var(--font-weight-title);
}

.tech-pagination {
  :deep(.el-pager li),
  :deep(.btn-prev),
  :deep(.btn-next) {
    border-radius: var(--radius-sm);
  }
}

.code-text {
  font-family: var(--font-family-base);
}

@media (max-width: 768px) {
  .tech-pagination-container {
    align-items: flex-start;
    flex-direction: column;
    overflow-x: auto;
    padding: var(--space-sm);
  }
}
</style>
