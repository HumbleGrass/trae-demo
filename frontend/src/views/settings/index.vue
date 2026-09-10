<template>
  <TechPageLayout title="系统设置" subtitle="配置图书馆管理系统参数">
    <div class="settings-content fade-in-up">
      <!-- 借阅规则设置 -->
      <TechCard class="settings-card fade-in-up delay-1">
        <template #header>
          <h3 class="card-title neon-text">
            <span class="title-icon">▸</span>
            借阅规则
            <span class="data-stream">▋</span>
          </h3>
        </template>
        
        <el-form :model="borrowRules" label-width="140px" class="tech-form">
          <el-form-item label="最大借阅数量" class="form-item">
            <div class="tech-input-wrapper">
              <el-input-number 
                v-model="borrowRules.maxBorrowCount" 
                :min="1" 
                :max="20"
                size="default"
                class="tech-input"
              />
              <span class="input-border"></span>
            </div>
            <div class="field-desc code-text">每位会员最多可同时借阅的图书数量</div>
          </el-form-item>

          <el-form-item label="默认借阅天数" class="form-item">
            <div class="tech-input-wrapper">
              <el-input-number 
                v-model="borrowRules.defaultDays" 
                :min="1" 
                :max="90"
                size="default"
                class="tech-input"
              />
              <span class="input-border"></span>
            </div>
            <div class="field-desc code-text">图书默认可借阅的天数</div>
          </el-form-item>

          <el-form-item label="逾期罚款金额" class="form-item">
            <div class="tech-input-wrapper">
              <el-input-number 
                v-model="borrowRules.finePerDay" 
                :min="0" 
                :max="10"
                :step="0.5"
                size="default"
                class="tech-input"
              />
              <span class="input-border"></span>
            </div>
            <div class="field-desc code-text">每本图书每天逾期的罚款金额（元）</div>
          </el-form-item>

          <el-form-item label="最大续借次数" class="form-item">
            <div class="tech-input-wrapper">
              <el-input-number 
                v-model="borrowRules.maxRenewals" 
                :min="0" 
                :max="5"
                size="default"
                class="tech-input"
              />
              <span class="input-border"></span>
            </div>
            <div class="field-desc code-text">每本书最多可续借的次数</div>
          </el-form-item>
        </el-form>
      </TechCard>

      <!-- 系统通知设置 -->
      <TechCard class="settings-card fade-in-up delay-2">
        <template #header>
          <h3 class="card-title neon-text">
            <span class="title-icon">▸</span>
            系统通知
            <span class="data-stream">▋</span>
          </h3>
        </template>
        
        <el-form :model="notificationSettings" label-width="160px" class="tech-form">
          <el-form-item label="逾期提醒天数" class="form-item">
            <div class="tech-input-wrapper">
              <el-input-number 
                v-model="notificationSettings.overdueReminderDays" 
                :min="1" 
                :max="14"
                size="default"
                class="tech-input"
              />
              <span class="input-border"></span>
            </div>
            <div class="field-desc code-text">在到期前几天发送提醒通知</div>
          </el-form-item>

          <el-form-item label="启用邮件通知" class="form-item">
            <div class="toggle-wrapper">
              <el-switch 
                v-model="notificationSettings.emailNotification"
                active-color="#00f3ff"
                inactive-color="#3a3a4a"
                class="tech-switch"
              />
              <span class="switch-label">{{ notificationSettings.emailNotification ? '已启用' : '未启用' }}</span>
            </div>
            <div class="field-desc code-text">是否通过邮件发送系统通知</div>
          </el-form-item>

          <el-form-item label="启用短信通知" class="form-item">
            <div class="toggle-wrapper">
              <el-switch 
                v-model="notificationSettings.smsNotification"
                active-color="#00f3ff"
                inactive-color="#3a3a4a"
                class="tech-switch"
              />
              <span class="switch-label">{{ notificationSettings.smsNotification ? '已启用' : '未启用' }}</span>
            </div>
            <div class="field-desc code-text">是否通过短信发送重要通知</div>
          </el-form-item>
        </el-form>
      </TechCard>

      <!-- 操作按钮 -->
      <div class="action-section fade-in-up delay-3">
        <TechButton 
          :icon="Check"
          size="large"
          :loading="saving"
          @click="saveSettings"
        >
          保存设置
        </TechButton>
        <TechButton 
          variant="secondary"
          :icon="RefreshLeft"
          size="large"
          @click="resetSettings"
        >
          重置为默认值
        </TechButton>
      </div>
    </div>
  </TechPageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, RefreshLeft } from '@element-plus/icons-vue'
import TechPageLayout from '@/components/layout/TechPageLayout.vue'
import TechCard from '@/components/common/TechCard.vue'
import TechButton from '@/components/common/TechButton.vue'

const saving = ref(false)

const borrowRules = reactive({
  maxBorrowCount: 5,
  defaultDays: 30,
  finePerDay: 0.5,
  maxRenewals: 2
})

const notificationSettings = reactive({
  overdueReminderDays: 3,
  emailNotification: true,
  smsNotification: false
})

const saveSettings = async () => {
  saving.value = true
  
  setTimeout(() => {
    ElMessage.success('设置保存成功')
    saving.value = false
  }, 1000)
}

const resetSettings = () => {
  borrowRules.maxBorrowCount = 5
  borrowRules.defaultDays = 30
  borrowRules.finePerDay = 0.5
  borrowRules.maxRenewals = 2

  notificationSettings.overdueReminderDays = 3
  notificationSettings.emailNotification = true
  notificationSettings.smsNotification = false

  ElMessage.info('已重置为默认设置')
}

onMounted(() => {
  
})
</script>

<style lang="scss" scoped>
.settings-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 900px;
}

.settings-card {
  
  .card-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;

    .title-icon {
      color: var(--tech-neon-cyan);
      font-size: 14px;
    }

    .data-stream {
      color: var(--tech-neon-cyan);
      opacity: 0.5;
      animation: blink 1s ease-in-out infinite;
    }
  }
}

.tech-form {
  padding: 8px;

  .form-item {
    margin-bottom: 24px;

    :deep(.el-form-item__label) {
      font-family: var(--tech-font-mono);
      font-size: 13px;
      color: var(--tech-text-secondary);
      font-weight: 500;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
  }
}

.tech-input-wrapper {
  position: relative;
  width: 200px;

  .tech-input {
    
    :deep(.el-input__wrapper) {
      background: var(--tech-bg-dark) !important;
      border: 1px solid var(--tech-border-color) !important;
      box-shadow: none !important;
      border-radius: var(--tech-radius-sm) !important;
      transition: all var(--tech-transition-fast);

      &:hover,
      &.is-focus {
        border-color: var(--tech-neon-cyan) !important;
        box-shadow: 0 0 10px rgba(0, 245, 255, 0.15) !important;
      }
    }

    :deep(.el-input__inner) {
      color: var(--tech-text-primary);
      font-family: var(--tech-font-mono);
      font-size: 14px;
    }
  }

  .input-border {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--tech-neon-cyan), transparent);
    transition: width var(--tech-transition-base);
  }

  &:hover .input-border {
    width: 80%;
  }
}

.field-desc {
  margin-top: 6px;
  font-size: 11px;
  color: var(--tech-text-muted);
  letter-spacing: 0.02em;
}

.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;

  .switch-label {
    font-family: var(--tech-font-mono);
    font-size: 13px;
    color: var(--tech-text-secondary);
  }
}

.tech-switch {
  :deep(.el-switch__core) {
    border-radius: 20px;
  }
}

.action-section {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--tech-border-color);
}

@keyframes blink {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.code-text {
  font-family: var(--tech-font-mono);
}
</style>
