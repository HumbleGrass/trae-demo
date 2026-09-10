<template>
  <span class="status-tag" :class="tagClass">
    <span class="tag-icon">{{ tagIcon }}</span>
    <span class="tag-text">{{ statusText }}</span>
    <span v-if="closable" class="tag-close" @click="handleClose">×</span>
  </span>
</template>

<script setup lang="ts">
/**
 * StatusTag 组件 - 状态标签
 * @description 根据状态值显示不同颜色的 Notion 风格标签，用于借阅状态、书籍状态等
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  status: string
  type?: 'borrow' | 'book' | 'reservation' | 'fine'
  effect?: 'light' | 'dark' | 'plain'
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  effect: 'light',
  closable: false
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const normalizedStatus = computed(() => (props.status || '').toLowerCase())

const statusConfig = computed(() => {
  const configMap: Record<string, Record<string, { color: string; icon: string }>> = {
    borrow: {
      borrowed: { color: 'cyan', icon: '◈' },
      returned: { color: 'green', icon: '✓' },
      overdue: { color: 'red', icon: '!' },
      renewed: { color: 'yellow', icon: '⟳' }
    },
    book: {
      available: { color: 'green', icon: '◆' },
      borrowed: { color: 'yellow', icon: '◈' },
      reserved: { color: 'magenta', icon: '★' }
    },
    reservation: {
      pending: { color: 'yellow', icon: '◈' },
      notified: { color: 'cyan', icon: '◆' },
      fulfilled: { color: 'green', icon: '✓' },
      cancelled: { color: 'muted', icon: '×' },
      expired: { color: 'red', icon: '!' }
    },
    fine: {
      unpaid: { color: 'red', icon: '!' },
      paid: { color: 'green', icon: '✓' }
    }
  }
  return configMap[props.type || 'borrow']?.[normalizedStatus.value] || { color: 'muted', icon: '?' }
})

const tagClass = computed(() => `status-tag--${statusConfig.value.color}`)
const tagIcon = computed(() => statusConfig.value.icon)

const statusText = computed(() => {
  const textMap: Record<string, Record<string, string>> = {
    borrow: {
      borrowed: '借阅中',
      returned: '已归还',
      overdue: '已逾期',
      renewed: '已续借'
    },
    book: {
      available: '可借',
      borrowed: '已借出',
      reserved: '已预约'
    },
    reservation: {
      pending: '待处理',
      notified: '已通知',
      fulfilled: '已完成',
      cancelled: '已取消',
      expired: '已过期'
    },
    fine: {
      unpaid: '未缴纳',
      paid: '已缴纳'
    }
  }
  return textMap[props.type || 'borrow']?.[normalizedStatus.value] || props.status
})

const handleClose = () => { emit('close') }
</script>

<style lang="scss" scoped>
.status-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xxs);
  min-height: 24px;
  padding: 2px var(--space-xs);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  font-family: var(--font-family-base);
  font-size: var(--font-size-eyebrow);
  font-weight: var(--font-weight-title);
  line-height: 1;
  letter-spacing: 0;
}

.tag-icon {
  font-size: 9px;
}

.tag-close {
  cursor: pointer;
  opacity: 0.65;
}

.status-tag--cyan {
  color: var(--color-info);
  background: var(--color-info-soft);
  border-color: var(--color-info-border);
}

.status-tag--green {
  color: var(--color-success);
  background: var(--color-success-soft);
  border-color: var(--color-success-border);
}

.status-tag--yellow {
  color: var(--color-warning);
  background: var(--color-warning-soft);
  border-color: var(--color-warning-border);
}

.status-tag--red {
  color: var(--color-danger);
  background: var(--color-danger-soft);
  border-color: var(--color-danger-border);
}

.status-tag--magenta {
  color: var(--color-accent-purple-deep);
  background: rgba(214, 182, 246, 0.28);
  border-color: var(--color-accent-purple);
}

.status-tag--muted {
  color: var(--text-muted);
  background: var(--color-canvas-soft);
}
</style>
