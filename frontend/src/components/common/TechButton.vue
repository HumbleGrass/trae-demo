<template>
  <el-button :type="btnType" :size="size" :loading="loading" class="tech-btn" :class="btnClass" @click="handleClick">
    <span v-if="icon" class="btn-icon"><component :is="icon" /></span>
    <span v-if="$slots.default" class="btn-text"><slot></slot></span>
  </el-button>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | ''
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'small' | 'default' | 'large'
  loading?: boolean
  icon?: Object
  ghost?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: '',
  variant: 'primary',
  size: 'default',
  loading: false,
  ghost: false
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const slots = useSlots()

const btnType = computed(() => props.variant === 'primary' ? 'primary' : '')
const btnClass = computed(() => ({
  'tech-btn-primary': props.variant === 'primary',
  'tech-btn--secondary': props.variant === 'secondary',
  'tech-btn--success': props.variant === 'success',
  'tech-btn--warning': props.variant === 'warning',
  'tech-btn--danger': props.variant === 'danger',
  'tech-btn--small': props.size === 'small',
  'tech-btn--icon': !slots.default && props.icon,
  'tech-btn--ghost': props.ghost
}))

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
.tech-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  height: var(--control-height-lg);
  padding: 0 20px;
  overflow: hidden;
  position: relative;
  color: var(--color-on-primary);
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-full);
  box-shadow: none;
  font-family: var(--font-family-base);
  font-size: var(--font-size-button);
  font-weight: var(--font-weight-button);
  letter-spacing: 0;
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);

  &:hover {
    color: var(--color-on-primary);
    background: var(--color-primary-active);
    border-color: var(--color-primary-active);
    box-shadow: var(--shadow-soft);
  }

  &.tech-btn--secondary,
  &.tech-btn--ghost {
    color: var(--text-primary);
    background: var(--color-surface);
    border-color: var(--border-default);
    border-radius: var(--radius-md);
    box-shadow: none;

    &:hover {
      color: var(--text-primary);
      background: var(--color-canvas-soft);
      border-color: var(--color-ink-faint);
    }
  }

  &.tech-btn--success {
    color: var(--color-success);
    background: var(--color-success-soft);
    border-color: var(--color-success-border);
    border-radius: var(--radius-md);

    &:hover {
      color: var(--color-success);
      background: var(--color-success-soft);
      border-color: var(--color-success);
    }
  }

  &.tech-btn--warning {
    color: var(--color-warning);
    background: var(--color-warning-soft);
    border-color: var(--color-warning-border);
    border-radius: var(--radius-md);

    &:hover {
      color: var(--color-warning);
      background: var(--color-warning-soft);
      border-color: var(--color-warning);
    }
  }

  &.tech-btn--danger {
    color: var(--color-danger);
    background: var(--color-danger-soft);
    border-color: var(--color-danger-border);
    border-radius: var(--radius-md);

    &:hover {
      color: var(--color-danger);
      background: var(--color-danger-soft);
      border-color: var(--color-danger);
    }
  }

  &.tech-btn--small {
    height: var(--control-height-sm);
    padding: 0 var(--space-sm);
    font-size: 13px;
  }

  &.tech-btn--icon {
    width: var(--control-height-md);
    height: var(--control-height-md);
    padding: 0;
    min-width: var(--control-height-md);
    border-radius: var(--radius-full);
  }
}
</style>
