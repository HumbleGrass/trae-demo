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
    font-weight: 600;
  }
}

.tech-pagination {
  :deep(.el-pager li) {
    font-family: var(--tech-font-mono);
    font-weight: 500;
    border-radius: 2px !important;
    margin: 0 2px;
    background: var(--tech-bg-dark);
    color: var(--tech-text-secondary);
    border: 1px solid var(--tech-border-color);
    min-width: 32px !important;
    height: 32px !important;
    line-height: 30px !important;
    transition: all var(--tech-transition-fast);
    
    &:hover {
      color: var(--tech-neon-cyan) !important;
      border-color: var(--tech-neon-cyan) !important;
      box-shadow: 0 0 8px rgba(0, 245, 255, 0.3);
    }
  }
  
  :deep(.btn-prev),
  :deep(.btn-next) {
    border-radius: 2px !important;
    background: var(--tech-bg-dark);
    border: 1px solid var(--tech-border-color);
    color: var(--tech-text-secondary);
    min-width: 32px !important;
    height: 32px !important;
    transition: all var(--tech-transition-fast);
    
    &:hover {
      color: var(--tech-neon-cyan) !important;
      border-color: var(--tech-neon-cyan) !important;
      box-shadow: 0 0 8px rgba(0, 245, 255, 0.3);
    }
  }
  
  :deep(.is-active) {
    background: rgba(0, 245, 255, 0.15) !important;
    color: var(--tech-neon-cyan) !important;
    border-color: var(--tech-neon-cyan) !important;
    box-shadow: 
      0 0 10px rgba(0, 245, 255, 0.3),
      inset 0 0 10px rgba(0, 245, 255, 0.1) !important;
    font-weight: 700;
  }
  
  :deep(.el-select) {
    margin-left: 8px;

    .el-select__wrapper {
      background: rgba(10, 10, 26, 0.98) !important;
      background-color: rgba(10, 10, 26, 0.98) !important;
      border: 1px solid rgba(0, 243, 255, 0.3) !important;
      border-color: rgba(0, 243, 255, 0.3) !important;
      box-shadow: none !important;
      border-radius: 2px !important;
      height: 32px !important;
      min-height: 32px !important;
      transition: all 0.25s ease !important;

      &:hover {
        border-color: #00f3ff !important;
        box-shadow: 0 0 12px rgba(0, 245, 255, 0.25) !important;
        background: rgba(8, 8, 22, 1) !important;
        background-color: rgba(8, 8, 22, 1) !important;
      }
    }

    .el-select__placeholder {
      color: var(--tech-text-secondary) !important;
      font-family: var(--tech-font-mono);
      font-size: 13px !important;
    }

    .el-select__caret,
    .el-select__icon {
      color: var(--tech-neon-cyan) !important;
    }

    &.is-focused .el-select__wrapper {
      border-color: var(--tech-neon-cyan) !important;
      box-shadow:
        0 0 14px rgba(0, 245, 255, 0.3),
        inset 0 0 10px rgba(0, 245, 255, 0.06) !important;
    }
  }
}

.code-text {
  font-family: var(--tech-font-mono);
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
