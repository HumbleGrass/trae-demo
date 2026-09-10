<template>
  <div class="tech-card">
    <div class="corner-decoration corner-tl"></div>
    <div class="corner-decoration corner-tr"></div>
    <div class="corner-decoration corner-bl"></div>
    <div class="corner-decoration corner-br"></div>
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// 科技风格卡片组件 - 带角落装饰
interface Props {
  showDecor?: boolean
}

withDefaults(defineProps<Props>(), {
  showDecor: true
})
</script>

<style lang="scss" scoped>
.tech-card {
  padding: var(--space-lg);
  position: relative;
  overflow: hidden;
  background: var(--surface-panel);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

  &:hover {
    border-color: var(--color-ink-faint);
    box-shadow: var(--shadow-soft);
  }
}

.corner-decoration {
  display: none;
}

.card-content {
  position: relative;
  z-index: 1;
}
</style>
