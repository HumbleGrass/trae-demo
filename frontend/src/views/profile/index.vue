<template>
  <TechPageLayout title="个人中心" subtitle="管理您的账户信息">
    <div class="profile-content fade-in-up">
      <!-- 用户信息卡片 -->
      <TechCard class="profile-card fade-in-up delay-1">
        <div class="profile-header">
          <!-- 头像区域 -->
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <div class="avatar-glow"></div>
              <div class="avatar-scanline"></div>
              <el-avatar :size="100" :icon="UserFilled" class="user-avatar" />
            </div>
            <div class="status-badge online">
              <span class="status-dot"></span>
              <span class="status-text">在线</span>
            </div>
          </div>

          <!-- 用户基本信息 -->
          <div class="user-info">
            <h1 class="username neon-text">{{ userStore.userInfo?.username || '用户' }}</h1>
            <p class="user-email code-text">{{ userStore.userInfo?.email || '未设置邮箱' }}</p>
            
            <div class="user-meta-grid">
              <div class="meta-item">
                <span class="meta-label code-text">角色</span>
                <span class="meta-value">{{ userStore.userInfo?.role === 'admin' ? '管理员' : '普通用户' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label code-text">注册时间</span>
                <span class="meta-value code-text">{{ formatDate(userStore.userInfo?.createdAt) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label code-text">账户状态</span>
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
              <div class="stat-value code-text">{{ userStats.totalBorrows }}</div>
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
              <div class="stat-value code-text">{{ userStats.activeBorrows }}</div>
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
              <div class="stat-value code-text">{{ userStats.reservations }}</div>
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
              <div class="stat-value code-text">{{ userStats.favorites }}</div>
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
  padding-top: 4px;
  padding-left: 4px;
  position: relative;
  width: 120px;
  height: 120px;

  .avatar-glow {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: conic-gradient(from 0deg, var(--tech-neon-cyan), var(--tech-neon-magenta), var(--tech-neon-cyan));
    animation: rotate-glow 3s linear infinite;
    opacity: 0.6;
  }

  .avatar-scanline {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(transparent, rgba(255, 255, 255, 0.6), transparent);
    animation: avatar-scan 2s linear infinite;
  }

  @keyframes rotate-glow {
    to { transform: rotate(360deg); }
  }

  @keyframes avatar-scan {
    0% { transform: translateY(0); }
    100% { transform: translateY(117px); }
  }

  .user-avatar {
    position: relative;
    z-index: 1;
    width: 112px !important;
    height: 112px !important;
    font-size: 48px !important;
    background: var(--tech-bg-dark) !important;
    color: var(--tech-neon-cyan) !important;
    border: 2px solid var(--tech-neon-cyan) !important;
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
  }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--tech-radius-full);
  font-family: var(--tech-font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  &.online {
    background: rgba(0, 255, 136, 0.15);
    color: var(--tech-neon-green);
    border: 1px solid var(--tech-neon-green);
  }

  .status-dot {
    width: 6px;
    height: 6px;
    background: currentColor;
    border-radius: 50%;
    animation: pulse-dot 1.5s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.5); }
  }
}

.user-info {
  flex: 1;
  min-width: 0;
}

.username {
  font-family: var(--tech-font-display);
  font-size: 32px;
  font-weight: 700;
  color: var(--tech-text-primary);
  margin: 0 0 8px 0;
  letter-spacing: 1px;
}

.user-email {
  font-size: 14px;
  color: var(--tech-text-secondary);
  margin: 0 0 24px 0;
}

.user-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.meta-item {
  padding: 14px;
  background: var(--tech-bg-dark);
  border: 1px solid var(--tech-border-color);
  border-radius: var(--tech-radius-sm);

  .meta-label {
    display: block;
    font-size: 11px;
    color: var(--tech-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 6px;
  }

  .meta-value {
    font-size: 14px;
    color: var(--tech-text-primary);
    font-weight: 500;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  .stat-card {
    transition: all var(--tech-transition-base);

    &:hover {
      transform: translateY(-4px);
      border-color: var(--tech-border-strong);
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
      border-radius: var(--tech-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.borrows {
        background: rgba(0, 245, 255, 0.1);
        color: var(--tech-neon-cyan);
        border: 1px solid var(--tech-neon-cyan);
        box-shadow: 0 0 15px rgba(0, 245, 255, 0.2);
      }

      &.active {
        background: rgba(0, 255, 136, 0.1);
        color: var(--tech-neon-green);
        border: 1px solid var(--tech-neon-green);
        box-shadow: 0 0 15px rgba(0, 255, 136, 0.2);
      }

      &.reservations {
        background: rgba(255, 190, 11, 0.1);
        color: var(--tech-neon-yellow);
        border: 1px solid var(--tech-neon-yellow);
        box-shadow: 0 0 15px rgba(255, 190, 11, 0.2);
      }

      &.favorites {
        background: rgba(255, 0, 255, 0.1);
        color: var(--tech-neon-magenta);
        border: 1px solid var(--tech-neon-magenta);
        box-shadow: 0 0 15px rgba(255, 0, 255, 0.2);
      }
    }

    .stat-info {
      .stat-value {
        font-family: var(--tech-font-display);
        font-size: 26px;
        font-weight: 700;
        color: var(--tech-text-primary);
        line-height: 1.2;
      }

      .stat-label {
        font-size: 12px;
        color: var(--tech-text-muted);
        margin-top: 4px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
  }
}


.code-text {
  font-family: var(--tech-font-mono);
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
