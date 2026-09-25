<template>
  <div class="tech-card">
    <div class="corner-decoration corner-tl"></div>
    <div class="corner-decoration corner-tr"></div>
    <div class="corner-decoration corner-bl"></div>
    <div class="corner-decoration corner-br"></div>
    <div v-if="title || $slots.title" class="card-title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="card-content">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// 通用内容卡片组件
// 使用说明：
// 1. title prop 与 title 插槽二选一，二者等价
// 2. footer 插槽可选，用于卡片底部操作区
// 3. showDecor 保留以兼容历史调用，角落装饰已在 Notion 风格迁移中禁用
interface Props {
  title?: string
  showDecor?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '',
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

.card-title {
  margin-bottom: var(--space-md);
  color: var(--text-primary);
  font-size: var(--font-size-subtitle);
  font-weight: var(--font-weight-title);
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-footer {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-default);
}
</style>
