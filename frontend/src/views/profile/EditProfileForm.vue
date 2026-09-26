<template>
  <TechCard class="profile-card fade-in-up delay-3">
    <div class="card-header">
      <h3 class="card-title">
        个人信息
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
        <el-input
          v-model="formData.username"
          size="default"
          placeholder="请输入用户名"
        />
      </el-form-item>

      <el-form-item label="电子邮箱" class="form-item">
        <el-input
          v-model="formData.email"
          size="default"
          placeholder="请输入邮箱地址"
          type="email"
        />
      </el-form-item>

      <el-form-item label="手机号码" class="form-item">
        <el-input
          v-model="formData.phone"
          size="default"
          placeholder="请输入手机号"
        />
      </el-form-item>

      <el-form-item label="个人简介" class="form-item">
        <el-input
          v-model="formData.bio"
          type="textarea"
          :rows="4"
          size="default"
          placeholder="介绍一下自己..."
        />
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
    color: var(--text-primary);
    font-family: var(--font-family-base);
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
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-default);
    transition: border-color var(--transition-fast);

    &:hover {
      border-color: var(--color-primary);
    }

    .field-label {
      width: 120px;
      font-family: var(--font-family-base);
      font-size: 13px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .field-value {
      flex: 1;
      color: var(--text-primary);
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
      font-family: var(--font-family-base);
      font-size: 13px;
      color: var(--text-primary);
      font-weight: 500;
    }
  }
}

@media (max-width: 768px) {
  .profile-field {
    flex-direction: column;

    .field-label {
      width: auto;
      margin-bottom: 8px;
    }
  }
}
</style>
