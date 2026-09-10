<template>
  <span class="status-tag" :class="tagClass">
    <span class="tag-icon">{{ tagIcon }}</span>
    <span class="tag-text">{{ statusText }}</span>
    <span v-if="closable" class="tag-close" @click="handleClose">×</span>
  </span>
</template>

<script setup lang="ts">
/**
 * StatusTag 组件 - 状态标签 (科技风格)
 * @description 根据状态值显示不同颜色的标签，用于借阅状态、书籍状态等
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
@media not all {
.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 2px;
  font-family: var(--tech-font-mono);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  overflow: hidden;
  transition: all var(--tech-transition-fast);

  .tag-icon {
    font-size: 10px;
    line-height: 1;
  }

  .tag-text {
    line-height: 1;
  }

  .tag-close {
    margin-left: 4px;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    opacity: 0.7;
    transition: opacity var(--tech-transition-fast);

    &:hover {
      opacity: 1;
    }
  }

  // Cyan (借阅中, 已通知)
  &.status-tag--cyan {
    background: rgba(0, 245, 255, 0.1);
    border: 1px solid var(--tech-neon-cyan);
    color: var(--tech-neon-cyan);
    box-shadow: 0 0 10px rgba(0, 245, 255, 0.2);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.2), transparent);
      animation: shimmer 2s infinite;
    }
  }

  // Green (已归还, 可借, 已完成, 已缴纳)
  &.status-tag--green {
    background: rgba(190, 242, 100, 0.1);
    border: 1px solid var(--tech-neon-green);
    color: var(--tech-neon-green);
    box-shadow: 0 0 10px rgba(190, 242, 100, 0.2);
  }

  // Red (已逾期, 已过期, 未缴纳)
  &.status-tag--red {
    background: rgba(255, 0, 110, 0.1);
    border: 1px solid var(--tech-neon-red);
    color: var(--tech-neon-red);
    box-shadow: 0 0 10px rgba(255, 0, 110, 0.2);
    animation: pulse-red 2s ease-in-out infinite;
  }

  // Yellow (已续借, 已借出, 待处理)
  &.status-tag--yellow {
    background: rgba(255, 190, 11, 0.1);
    border: 1px solid var(--tech-neon-yellow);
    color: var(--tech-neon-yellow);
    box-shadow: 0 0 10px rgba(255, 190, 11, 0.2);
  }

  // Magenta (已预约)
  &.status-tag--magenta {
    background: rgba(131, 56, 236, 0.1);
    border: 1px solid var(--tech-neon-magenta);
    color: var(--tech-neon-magenta);
    box-shadow: 0 0 10px rgba(131, 56, 236, 0.2);
  }

  // Muted (已取消, 默认)
  &.status-tag--muted {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--tech-border-color);
    color: var(--tech-text-muted);
  }
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 0, 110, 0.2); }
  50% { box-shadow: 0 0 20px rgba(255, 0, 110, 0.5); }
}
}
</style>

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
