<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    class="tech-modal"
    @update:model-value="handleUpdateVisible"
    @close="handleClose"
  >
    <div class="modal-header" v-if="title">
      <div class="modal-header__icon" v-if="icon">
        <component :is="icon" />
      </div>
      <div class="modal-header__text">
        <h3 class="modal-title">{{ title }}</h3>
        <p class="modal-subtitle" v-if="subtitle">{{ subtitle }}</p>
      </div>
    </div>

    <div class="modal-content">
      <slot></slot>
    </div>

    <template #footer>
      <div class="modal-footer">
        <slot name="footer">
          <el-button class="tech-btn tech-btn--secondary" size="default" @click="handleClose">
            <span class="btn-text">{{ t('common.cancel') }}</span>
          </el-button>
          <el-button type="primary" class="tech-btn" size="default" :loading="confirmLoading" @click="handleConfirm">
            <span class="btn-text">{{ t('common.confirm') }}</span>
          </el-button>
        </slot>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
/**
 * BaseModal 组件 - 模态框封装 (科技风格)
 * @description 提供统一的模态框样式和交互，支持自定义标题、宽度、加载状态
 */
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  visible: boolean
  title: string
  subtitle?: string
  icon?: any
  width?: string | number
  confirmLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  width: '500px',
  confirmLoading: false
})

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const handleUpdateVisible = (value: boolean) => {
  emit('update:visible', value)
}

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style lang="scss" scoped>
.tech-modal {
  :deep(.el-dialog__header) {
    display: none;
  }

  :deep(.el-dialog__body),
  :deep(.el-dialog__footer) {
    padding: 0;
  }

  :deep(.el-dialog__footer) {
    border-top: 1px solid var(--border-default);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-lg) var(--space-md);
}

.modal-header__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  color: var(--color-primary);
  background: var(--color-info-soft);
  border-radius: var(--radius-md);
}

.modal-header__text {
  min-width: 0;
}

.modal-title {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-family-base);
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-title);
  letter-spacing: var(--letter-spacing-title);
}

.modal-subtitle {
  margin: var(--space-xxs) 0 0;
  color: var(--text-muted);
  font-family: var(--font-family-base);
  font-size: var(--font-size-caption);
}

.modal-content {
  padding: 0 var(--space-lg) var(--space-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-xs);
  padding: var(--space-md) var(--space-lg);
  background: var(--color-canvas-soft);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}
</style>
