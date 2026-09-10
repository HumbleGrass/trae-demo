<template>
  <TechCard class="profile-card fade-in-up delay-3">
    <div class="card-header">
      <h3 class="card-title neon-text">
        <span class="title-icon">▸</span>
        个人信息
        <span class="data-stream">▋</span>
      </h3>
      <div class="card-actions">
        <TechButton
          v-if="!isEditing"
          :icon="Edit"
          size="small"
          @click="toggleEdit"
        >
          编辑
        </TechButton>
        <div v-else class="edit-actions">
          <TechButton
            :icon="Check"
            size="small"
            :loading="saving"
            @click="saveProfile"
          >
            保存
          </TechButton>
          <TechButton
            variant="secondary"
            :icon="RefreshLeft"
            size="small"
            @click="cancelEdit"
          >
            取消
          </TechButton>
        </div>
      </div>
    </div>

    <!-- 查看模式 -->
    <div v-if="!isEditing" class="profile-view">
      <div class="profile-field">
        <label class="field-label">用户名</label>
        <span class="field-value">{{ formData.username || '未设置' }}</span>
      </div>

      <div class="profile-field">
        <label class="field-label">电子邮箱</label>
        <span class="field-value">{{ formData.email || '未设置' }}</span>
      </div>

      <div class="profile-field">
        <label class="field-label">手机号码</label>
        <span class="field-value">{{ formData.phone || '未设置' }}</span>
      </div>

      <div class="profile-field">
        <label class="field-label">个人简介</label>
        <div class="field-value bio-value">{{ formData.bio || '未设置' }}</div>
      </div>
    </div>

    <!-- 编辑模式 -->
    <el-form v-else :model="formData" label-width="100px" class="tech-form">
      <el-form-item label="用户名" class="form-item">
        <div class="tech-input-wrapper">
          <el-input
            v-model="formData.username"
            size="default"
            class="tech-input"
            placeholder="请输入用户名"
          />
          <span class="input-border"></span>
        </div>
      </el-form-item>

      <el-form-item label="电子邮箱" class="form-item">
        <div class="tech-input-wrapper">
          <el-input
            v-model="formData.email"
            size="default"
            class="tech-input"
            placeholder="请输入邮箱地址"
            type="email"
          />
          <span class="input-border"></span>
        </div>
      </el-form-item>

      <el-form-item label="手机号码" class="form-item">
        <div class="tech-input-wrapper">
          <el-input
            v-model="formData.phone"
            size="default"
            class="tech-input"
            placeholder="请输入手机号"
          />
          <span class="input-border"></span>
        </div>
      </el-form-item>

      <el-form-item label="个人简介" class="form-item">
        <div class="tech-textarea-wrapper">
          <el-input
            v-model="formData.bio"
            type="textarea"
            :rows="4"
            size="default"
            class="tech-textarea"
            placeholder="介绍一下自己..."
          />
          <span class="textarea-border"></span>
        </div>
      </el-form-item>
    </el-form>
  </TechCard>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, Check, RefreshLeft } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import TechCard from '@/components/common/TechCard.vue'
import TechButton from '@/components/common/TechButton.vue'

const userStore = useUserStore()
const saving = ref(false)
const isEditing = ref(false)

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      username: '',
      email: '',
      phone: '',
      bio: ''
    })
  }
})

const emit = defineEmits(['save'])

const formData = reactive({
  username: '',
  email: '',
  phone: '',
  bio: ''
})

// 保存原始数据用于取消编辑
const originalData = ref({ ...props.initialData })

// 监听初始数据变化并更新表单
watch(() => props.initialData, (newData) => {
  formData.username = newData.username || ''
  formData.email = newData.email || ''
  formData.phone = newData.phone || ''
  formData.bio = newData.bio || ''
  originalData.value = { ...newData }
}, { immediate: true })

const toggleEdit = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  // 恢复原始数据
  formData.username = originalData.value.username || ''
  formData.email = originalData.value.email || ''
  formData.phone = originalData.value.phone || ''
  formData.bio = originalData.value.bio || ''
}

const saveProfile = async () => {
  saving.value = true

  // 模拟保存请求
  setTimeout(() => {
    ElMessage.success('个人信息保存成功')
    saving.value = false
    isEditing.value = false
    // 更新原始数据
    originalData.value = { ...formData }
    emit('save', formData)
  }, 1000)
}
</script>

<style lang="scss" scoped>
.profile-card {

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

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

  .card-actions {
    display: flex;
    justify-content: flex-end;
  }

  .edit-actions {
    display: flex;
    gap: 8px;
  }
}

.profile-view {
  padding: 16px;

  .profile-field {
    display: flex;
    margin-bottom: 20px;
    padding: 12px;
    background: var(--tech-bg-card);
    border-radius: var(--tech-radius-sm);
    border: 1px solid var(--tech-border-color);
    transition: all var(--tech-transition-fast);

    &:hover {
      border-color: var(--tech-neon-cyan);
      box-shadow: 0 0 10px rgba(0, 245, 255, 0.1);
    }

    .field-label {
      width: 120px;
      font-family: var(--tech-font-mono);
      font-size: 13px;
      color: var(--tech-text-secondary);
      font-weight: 500;
      letter-spacing: 0.05em;
    }

    .field-value {
      flex: 1;
      color: var(--tech-text-primary);
      font-family: var(--tech-font-body);
      font-size: 14px;
      line-height: 1.5;
    }

    .bio-value {
      white-space: pre-wrap;
      word-break: break-word;
    }
  }
}

.tech-form {
  padding: 8px;

  .form-item {
    margin-bottom: 20px;

    :deep(.el-form-item__label) {
      font-family: var(--tech-font-mono);
      font-size: 13px;
      color: var(--tech-text-primary) !important;
      font-weight: 500;
      letter-spacing: 0.05em;
    }
  }
}

.tech-input-wrapper {
  position: relative;
  width: 400px;

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
      color: var(--tech-text-primary) !important;
      font-family: var(--tech-font-body);
      font-size: 14px;
      caret-color: var(--tech-neon-cyan) !important;
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

.tech-textarea-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px;

  .tech-textarea {

    :deep(.el-textarea__inner) {
      background: var(--tech-bg-dark) !important;
      border: 1px solid var(--tech-border-color) !important;
      box-shadow: none !important;
      border-radius: var(--tech-radius-sm) !important;
      color: var(--tech-text-primary) !important;
      font-family: var(--tech-font-body);
      font-size: 14px;
      transition: all var(--tech-transition-fast);
      caret-color: var(--tech-neon-cyan) !important;

      &:hover,
      &:focus {
        border-color: var(--tech-neon-cyan) !important;
        box-shadow: 0 0 10px rgba(0, 245, 255, 0.15) !important;
      }
    }
  }

  .textarea-border {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--tech-neon-cyan), transparent);
    transition: width var(--tech-transition-base);
  }

  &:hover .textarea-border {
    width: 80%;
  }
}

@keyframes blink {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.code-text {
  font-family: var(--tech-font-mono);
}

@media (max-width: 768px) {
  .tech-input-wrapper {
    width: 100%;
  }

  .profile-field {
    flex-direction: column;

    .field-label {
      width: auto;
      margin-bottom: 8px;
    }
  }
}
</style>
