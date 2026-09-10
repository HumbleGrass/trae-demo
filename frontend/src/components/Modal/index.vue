<!--
  ⚠️ 此组件已废弃
  
  请使用 @/components/common/BaseModal 替代
  BaseModal 已完全实现科技风格，包含：
  - 玻璃态背景效果
  - 霓虹边框动画
  - 科技风格按钮
  - 完整的科技字体系统

  迁移示例：
  
  ❌ 旧用法:
  <Modal :visible="show" title="标题" @confirm="handleConfirm" />
  
  ✅ 新用法:
  <BaseModal :visible="show" title="标题" :icon="Edit" @confirm="handleConfirm">
    <p>内容</p>
  </BaseModal>
-->
<template>
  <div class="deprecated-notice">
    <div class="notice-icon">⚠</div>
    <h3 class="notice-title">组件已废弃</h3>
    <p class="notice-text">请使用 BaseModal 组件替代此组件</p>
    <code class="notice-code">import { BaseModal } from '@/components/common'</code>
  </div>
</template>

<script setup lang="ts">
console.warn('[Deprecated] Modal component is deprecated. Please use BaseModal instead.')
</script>

<style scoped lang="scss">
.deprecated-notice {
  padding: 40px;
  text-align: center;
  background: rgba(255, 170, 0, 0.1);
  border: 2px dashed var(--color-warning);
  border-radius: var(--radius-md);
}

.notice-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.notice-title {
  font-family: var(--font-family-base);
  font-size: 20px;
  color: var(--color-warning);
  margin-bottom: 12px;
}

.notice-text {
  font-family: var(--font-family-base);
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.notice-code {
  display: inline-block;
  padding: 8px 16px;
  background: var(--color-surface);
  color: var(--color-primary);
  font-family: var(--font-family-base);
  font-size: 13px;
  border-radius: 4px;
  border: 1px solid var(--border-default);
}
</style>
