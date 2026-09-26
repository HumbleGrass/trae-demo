<template>
  <TechPageLayout title="个人中心" subtitle="管理您的账户信息">
    <div class="profile-content fade-in-up">
      <!-- 用户信息卡片 -->
      <TechCard class="profile-card fade-in-up delay-1">
        <div class="profile-header">
          <!-- 头像区域 -->
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <el-avatar :size="100" :icon="UserFilled" class="user-avatar" />
            </div>
            <div class="status-badge online">
              <span class="status-dot"></span>
              <span class="status-text">在线</span>
            </div>
          </div>

          <!-- 用户基本信息 -->
          <div class="user-info">
            <h1 class="username">{{ userStore.userInfo?.username || '用户' }}</h1>
            <p class="user-email">{{ userStore.userInfo?.email || '未设置邮箱' }}</p>
            
            <div class="user-meta-grid">
              <div class="meta-item">
                <span class="meta-label">角色</span>
                <span class="meta-value">{{ userStore.userInfo?.role === 'admin' ? '管理员' : '普通用户' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">注册时间</span>
                <span class="meta-value">{{ formatDate(userStore.userInfo?.createdAt) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">账户状态</span>
                <StatusTag status="active" />
              </div>
            </div>
          </div>
        </div>
      </TechCard>

      <!-- 个人数据统计 -->
      <div class="stats-grid fade-in-up delay-2">
        <TechCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon borrows">
              <el-icon :size="24"><Reading /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ userStats.totalBorrows }}</div>
              <div class="stat-label">总借阅数</div>
            </div>
          </div>
        </TechCard>

        <TechCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon active">
              <el-icon :size="24"><Collection /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ userStats.activeBorrows }}</div>
              <div class="stat-label">当前借阅</div>
            </div>
          </div>
        </TechCard>

        <TechCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon reservations">
              <el-icon :size="24"><Bell /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ userStats.reservations }}</div>
              <div class="stat-label">预约数量</div>
            </div>
          </div>
        </TechCard>

        <TechCard class="stat-card">
          <div class="stat-content">
            <div class="stat-icon favorites">
              <el-icon :size="24"><Star /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ userStats.favorites }}</div>
              <div class="stat-label">收藏图书</div>
            </div>
          </div>
        </TechCard>
      </div>

      <!-- 编辑表单 -->
      <EditProfileForm
        :initial-data="userStore.userInfo || { username: '', email: '', phone: '', bio: '' }"
        @save="handleSaveProfile"
      />
    </div>
  </TechPageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { UserFilled, Reading, Collection, Bell, Star } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import StatusTag from '@/components/common/StatusTag.vue'
import TechPageLayout from '@/components/layout/TechPageLayout.vue'
import TechCard from '@/components/common/TechCard.vue'
import EditProfileForm from './EditProfileForm.vue'

const userStore = useUserStore()

const userStats = reactive({
  totalBorrows: 0,
  activeBorrows: 0,
  reservations: 0,
  favorites: 0
})

const formatDate = (date: Date | string | undefined) => {
  if (!date) return '未知'
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN')
}

const handleSaveProfile = (data: any) => {
  // 这里可以处理保存后的逻辑，比如更新用户存储中的信息
  // 实际项目中可能会调用 API 来更新用户信息
}

onMounted(() => {
  // 模拟加载用户统计数据
  userStats.totalBorrows = 28
  userStats.activeBorrows = 3
  userStats.reservations = 2
  userStats.favorites = 15
})
</script>

<style lang="scss" scoped>
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card {
  .profile-header {
    display: flex;
    gap: 40px;
    padding: 32px;
  }
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;

  .user-avatar {
    position: relative;
    z-index: 1;

    :deep(.el-avatar) {
      width: 112px;
      height: 112px;
      font-size: 48px;
      background: var(--color-surface);
      color: var(--text-primary);
      border: 1px solid var(--border-default);
    }
  }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-family: var(--font-family-base);
  font-size: 11px;
  font-weight: 600;

  &.online {
    background: var(--color-success-soft);
    color: var(--color-success);
    border: 1px solid var(--color-success-border);
  }
}

.user-info {
  flex: 1;
  min-width: 0;
}

.username {
  font-family: var(--font-family-base);
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.user-email {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
}

.user-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.meta-item {
  padding: 14px;
  background: var(--color-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);

  .meta-label {
    display: block;
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 6px;
  }

  .meta-value {
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 500;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  .stat-card {
    transition: transform var(--transition-base), border-color var(--transition-base);

    &:hover {
      transform: translateY(-4px);
      border-color: var(--border-default);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.borrows {
        background: var(--color-info-soft);
        color: var(--color-info);
      }

      &.active {
        background: var(--color-success-soft);
        color: var(--color-success);
      }

      &.reservations {
        background: var(--color-warning-soft);
        color: var(--color-warning);
      }

      &.favorites {
        background: var(--color-danger-soft);
        color: var(--color-danger);
      }
    }

    .stat-info {
      .stat-value {
        font-family: var(--font-family-base);
        font-size: 26px;
        font-weight: 700;
        color: var(--text-primary);
        line-height: 1.2;
      }

      .stat-label {
        font-size: 12px;
        color: var(--text-muted);
        margin-top: 4px;
      }
    }
  }
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .user-meta-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
