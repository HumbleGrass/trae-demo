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
            <span class="btn-glow"></span>
          </el-button>
          <el-button type="primary" class="tech-btn" size="default" :loading="confirmLoading" @click="handleConfirm">
            <span class="btn-text">{{ t('common.confirm') }}</span>
            <span class="btn-glow"></span>
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
@media not all {
.tech-modal {
  :deep(.el-dialog) {
    background: var(--tech-bg-card);
    border: 1px solid var(--tech-border-color);
    border-radius: 4px;
    overflow: visible;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--tech-neon-cyan), var(--tech-neon-magenta), var(--tech-neon-cyan));
      background-size: 200% 100%;
      animation: border-flow 3s linear infinite;
    }
  }

  :deep(.el-dialog__header) {
    display: none;
  }

  :deep(.el-dialog__body) {
    padding: 0 !important;
  }

  :deep(.el-dialog__footer) {
    padding: 0;
    border-top: 1px solid var(--tech-border-color);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 32px 32px 24px;

  &__icon {
    width: 56px;
    height: 56px;
    border-radius: 2px;
    background: rgba(0, 245, 255, 0.1);
    color: var(--tech-neon-cyan);
    border: 1px solid var(--tech-neon-cyan);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.2);

    svg {
      width: 28px;
      height: 28px;
    }
  }

  &__text {
    flex: 1;
    min-width: 0;
  }
}

.modal-title {
  font-family: var(--tech-font-cyber);
  font-size: 22px;
  font-weight: 800;
  color: var(--tech-text-primary);
  margin: 0 0 4px 0;
  letter-spacing: 0.05em;
}

.modal-subtitle {
  font-family: var(--tech-font-mono);
  font-size: 13px;
  color: var(--tech-text-muted);
  margin: 0;
}

.modal-content {
  padding: 0 32px 24px;
}

.modal-footer {
  padding: 20px 32px 32px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  background: var(--tech-bg-dark);
}

@keyframes border-flow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
}
</style>

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
  letter-spacing: 0;
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
