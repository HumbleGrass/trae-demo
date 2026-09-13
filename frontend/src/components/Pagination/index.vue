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
