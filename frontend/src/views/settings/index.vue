<template>
  <TechPageLayout title="系统设置" subtitle="配置图书馆管理系统参数">
    <div class="settings-content fade-in-up">
      <!-- 借阅规则设置 -->
      <TechCard class="settings-card fade-in-up delay-1">
        <template #header>
          <h3 class="card-title">借阅规则</h3>
        </template>
        
        <el-form :model="borrowRules" label-width="140px" class="tech-form">
          <el-form-item label="最大借阅数量" class="form-item">
            <el-input-number 
              v-model="borrowRules.maxBorrowCount" 
              :min="1" 
              :max="20"
              size="default"
            />
            <div class="field-desc">每位会员最多可同时借阅的图书数量</div>
          </el-form-item>

          <el-form-item label="默认借阅天数" class="form-item">
            <el-input-number 
              v-model="borrowRules.defaultDays" 
              :min="1" 
              :max="90"
              size="default"
            />
            <div class="field-desc">图书默认可借阅的天数</div>
          </el-form-item>

          <el-form-item label="逾期罚款金额" class="form-item">
            <el-input-number 
              v-model="borrowRules.finePerDay" 
              :min="0" 
              :max="10"
              :step="0.5"
              size="default"
            />
            <div class="field-desc">每本图书每天逾期的罚款金额（元）</div>
          </el-form-item>

          <el-form-item label="最大续借次数" class="form-item">
            <el-input-number 
              v-model="borrowRules.maxRenewals" 
              :min="0" 
              :max="5"
              size="default"
            />
            <div class="field-desc">每本书最多可续借的次数</div>
          </el-form-item>
        </el-form>
      </TechCard>

      <!-- 系统通知设置 -->
      <TechCard class="settings-card fade-in-up delay-2">
        <template #header>
          <h3 class="card-title">系统通知</h3>
        </template>
        
        <el-form :model="notificationSettings" label-width="160px" class="tech-form">
          <el-form-item label="逾期提醒天数" class="form-item">
            <el-input-number 
              v-model="notificationSettings.overdueReminderDays" 
              :min="1" 
              :max="14"
              size="default"
            />
            <div class="field-desc">在到期前几天发送提醒通知</div>
          </el-form-item>

          <el-form-item label="启用邮件通知" class="form-item">
            <div class="toggle-wrapper">
              <el-switch 
                v-model="notificationSettings.emailNotification"
              />
              <span class="switch-label">{{ notificationSettings.emailNotification ? '已启用' : '未启用' }}</span>
            </div>
            <div class="field-desc">是否通过邮件发送系统通知</div>
          </el-form-item>

          <el-form-item label="启用短信通知" class="form-item">
            <div class="toggle-wrapper">
              <el-switch 
                v-model="notificationSettings.smsNotification"
              />
              <span class="switch-label">{{ notificationSettings.smsNotification ? '已启用' : '未启用' }}</span>
            </div>
            <div class="field-desc">是否通过短信发送重要通知</div>
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
    color: var(--text-primary);
    font-family: var(--font-family-base);
  }
}

.tech-form {
  padding: 8px;

  .form-item {
    margin-bottom: 24px;

    :deep(.el-form-item__label) {
      font-family: var(--font-family-base);
      font-size: 13px;
      color: var(--text-secondary);
      font-weight: 500;
    }
  }
}

.field-desc {
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;

  .switch-label {
    font-family: var(--font-family-base);
    font-size: 13px;
    color: var(--text-secondary);
  }
}

.action-section {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-default);
}
</style>
