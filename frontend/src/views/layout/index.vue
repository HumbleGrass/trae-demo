<template>
  <el-container class="tech-layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '72px' : '260px'" class="tech-sidebar">
      <div class="sidebar-inner">
        <!-- Logo 区域 -->
        <div class="tech-logo-section">
          <div class="logo-icon-wrapper">
            <div class="logo-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9C6 7.34315 7.34315 6 9 6H27C28.6569 6 30 7.34315 30 9V33C30 34.6569 28.6569 36 27 36H9C7.34315 36 6 34.6569 6 33V9Z" fill="url(#techLogoGradient1)"/>
                <path d="M33 10.5C33 8.84315 34.3431 7.5 36 7.5H42C43.6569 7.5 45 8.84315 45 10.5V37.5C45 39.1569 43.6569 40.5 42 40.5H36C34.3431 40.5 33 39.1569 33 37.5V10.5Z" fill="url(#techLogoGradient2)"/>
                <path d="M10.5 13.5H25.5V15.5H10.5V13.5ZM10.5 18H25.5V20H10.5V18ZM10.5 22.5H25.5V24.5H10.5V22.5ZM10.5 27H19.5V29H10.5V27Z" fill="white"/>
                <defs>
                  <linearGradient id="techLogoGradient1" x1="6" y1="6" x2="30" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#62aef0"/>
                    <stop offset="1" stop-color="#0075de"/>
                  </linearGradient>
                  <linearGradient id="techLogoGradient2" x1="33" y1="7.5" x2="45" y2="40.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#391c57"/>
                    <stop offset="1" stop-color="#0075de"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div class="logo-text" v-show="!isCollapse">
            <h1>知阅阁</h1>
            <p>LIBRARY SYSTEM</p>
          </div>
        </div>

        <div class="tech-sidebar-divider" v-show="!isCollapse"></div>

        <!-- 导航菜单 -->
        <nav class="tech-sidebar-nav">
          <div class="nav-section">
            <el-menu
              :default-active="activeMenu"
              :collapse="isCollapse"
              :router="true"
              class="tech-sidebar-menu"
              :collapse-transition="false"
            >
              <el-menu-item index="/home" class="tech-menu-item">
                <el-icon class="menu-icon"><HomeFilled /></el-icon>
                <template #title>
                  <span class="menu-text">{{ t('menu.home') }}</span>
                </template>
              </el-menu-item>

              <template v-if="userStore.isAdmin">
                <el-menu-item index="/books" class="tech-menu-item">
                  <el-icon class="menu-icon"><Notebook /></el-icon>
                  <template #title>
                    <span class="menu-text">{{ t('menu.books') }}</span>
                  </template>
                </el-menu-item>

                <el-menu-item index="/members" class="tech-menu-item">
                  <el-icon class="menu-icon"><User /></el-icon>
                  <template #title>
                    <span class="menu-text">{{ t('menu.members') }}</span>
                  </template>
                </el-menu-item>
              </template>

              <el-menu-item index="/borrow" class="tech-menu-item">
                <el-icon class="menu-icon"><Reading /></el-icon>
                <template #title>
                  <span class="menu-text">{{ t('menu.borrow') }}</span>
                </template>
              </el-menu-item>

              <el-menu-item index="/reservations" class="tech-menu-item">
                <el-icon class="menu-icon"><Bell /></el-icon>
                <template #title>
                  <span class="menu-text">{{ t('menu.reservation') }}</span>
                </template>
              </el-menu-item>

              <template v-if="userStore.isAdmin">
                <el-menu-item index="/reports" class="tech-menu-item">
                  <el-icon class="menu-icon"><DataLine /></el-icon>
                  <template #title>
                    <span class="menu-text">{{ t('menu.reports') }}</span>
                  </template>
                </el-menu-item>

                <el-menu-item index="/analytics" class="tech-menu-item">
                  <el-icon class="menu-icon"><PieChart /></el-icon>
                  <template #title>
                    <span class="menu-text">{{ t('menu.analytics') }}</span>
                  </template>
                </el-menu-item>

                <el-menu-item index="/settings" class="tech-menu-item">
                  <el-icon class="menu-icon"><Setting /></el-icon>
                  <template #title>
                    <span class="menu-text">{{ t('menu.settings') }}</span>
                  </template>
                </el-menu-item>
              </template>
            </el-menu>
          </div>
        </nav>

      </div>
    </el-aside>

    <!-- 主内容区 -->
    <el-container class="tech-main-container">
      <!-- 顶部导航 -->
      <el-header class="tech-header">
        <div class="header-inner">
          <div class="header-left">
            <button class="tech-collapse-btn" aria-label="切换侧边栏" :aria-expanded="!isCollapse" @click="isCollapse = !isCollapse">
              <el-icon :size="20">
                <Fold v-if="!isCollapse" />
                <Expand v-else />
              </el-icon>
            </button>

            <div class="tech-breadcrumb-section">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">
                  <el-icon><HomeFilled /></el-icon>
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>

          <div class="header-right">
            <div class="tech-header-actions">
              <el-dropdown @command="handleLanguageChange" trigger="click">
                <button class="tech-action-btn lang-btn" aria-label="切换语言">
                  <el-icon><Translate /></el-icon>
                  <span class="btn-text">{{ currentLanguageLabel }}</span>
                </button>
                <template #dropdown>
                  <el-dropdown-menu class="tech-lang-dropdown">
                    <el-dropdown-item command="zh-CN" :class="{ active: locale === 'zh-CN' }">
                      <span class="lang-flag">🇨🇳</span>
                      <span>中文</span>
                    </el-dropdown-item>
                    <el-dropdown-item command="en-US" :class="{ active: locale === 'en-US' }">
                      <span class="lang-flag">🇺🇸</span>
                      <span>English</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <button class="tech-action-btn notification-btn" aria-label="通知">
                <el-icon><Bell /></el-icon>
                <span class="notification-badge">3</span>
              </button>
            </div>

            <div class="tech-user-section">
              <el-dropdown @command="handleCommand" trigger="click">
                <button class="tech-user-dropdown" aria-label="用户菜单">
                  <div class="user-avatar-wrapper">
                    <el-avatar :size="40" :icon="UserFilled" />
                  </div>
                  <div class="user-info" v-show="!isMobile">
                    <div class="user-name">{{ userStore.userInfo?.username || 'User' }}</div>
                    <div class="user-role">
                      <span class="role-dot"></span>
                      {{ userStore.isAdmin ? t('layout.admin') : t('layout.member') }}
                    </div>
                  </div>
                  <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
                </button>
                <template #dropdown>
                  <el-dropdown-menu class="tech-user-dropdown-menu">
                    <el-dropdown-item command="profile" class="dropdown-item">
                      <el-icon><User /></el-icon>
                      <span>{{ t('menu.profile') }}</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided command="logout" class="dropdown-item logout-item">
                      <el-icon><SwitchButton /></el-icon>
                      <span>{{ t('common.logout') }}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="tech-main-content">
        <div class="content-inner">
          <router-view v-slot="{ Component }">
            <transition name="tech-page-transition" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import {
  HomeFilled,
  Notebook,
  User,
  UserFilled,
  Reading,
  Bell,
  DataLine,
  PieChart,
  Setting,
  Fold,
  Expand,
  ArrowDown,
  SwitchButton
} from '@element-plus/icons-vue'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isCollapse = ref(false)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    isCollapse.value = true
  }
}

const activeMenu = computed(() => route.path)

const currentPageTitle = computed(() => {
  return route.meta.title as string || ''
})

const currentLanguageLabel = computed(() => {
  return locale.value === 'zh-CN' ? '中文' : 'EN'
})

const handleLanguageChange = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    await userStore.logoutAction()
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}

onMounted(async () => {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) {
    locale.value = savedLocale
  }

  checkMobile()
  window.addEventListener('resize', checkMobile)

  if (userStore.token && !userStore.userInfo) {
    try {
      await userStore.getUserInfoAction()
    } catch (error) {
      // silently ignore
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style lang="scss" scoped>
/* Notion-style application shell. Legacy class names remain as stable hooks. */
.tech-layout-container {
  height: 100vh;
  background: var(--surface-page);
  color: var(--text-primary);
  overflow: hidden;
}

.tech-sidebar {
  flex-shrink: 0;
  height: 100%;
  background: var(--color-canvas);
  border-right: 1px solid var(--border-default);
  box-shadow: none;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width var(--transition-base);

  &::before {
    display: none;
  }
}

.sidebar-inner {
  padding: var(--space-sm) var(--space-xs);
}

.tech-logo-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 48px;
  margin: 0;
  padding: 0;
  gap: var(--space-sm);

  .logo-icon-wrapper {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;

    .logo-icon {
      width: 32px;
      height: 32px;

      svg {
        width: 100%;
        height: 100%;
        display: block;
      }

      filter: none;
      animation: none;
    }
  }

  .logo-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;

    h1 {
      margin: 0;
      font-family: var(--font-family-base);
      font-size: var(--font-size-body-md);
      font-weight: var(--font-weight-heading);
      line-height: 1.3;
      color: var(--text-primary);
      text-shadow: none;
      letter-spacing: 0;
    }

    p {
      margin: 2px 0 0;
      font-family: var(--font-family-base);
      font-size: 10px;
      line-height: 1.2;
      color: var(--text-placeholder);
      letter-spacing: 0;
    }
  }
}

.tech-sidebar-divider {
  height: 1px;
  margin: var(--space-xs);
  background: var(--border-default);
  box-shadow: none;
}

.tech-sidebar-nav {
  padding: 0;
}

.tech-sidebar-menu {
  border: 0;
  background: transparent;

  :deep(.el-menu-item) {
    height: 40px;
    margin: 2px 0;
    padding: 0 var(--space-sm);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-family: var(--font-family-base);
    font-size: var(--font-size-caption);
    letter-spacing: 0;

    &::before,
    &::after {
      display: none;
    }

    &:hover {
      color: var(--text-primary);
      background: rgba(0, 0, 0, 0.04);
      box-shadow: none;
      transform: none;
    }

    &.is-active {
      color: var(--color-primary);
      background: var(--color-info-soft);
      box-shadow: inset 3px 0 0 var(--color-primary);
    }

    .el-icon {
      color: currentColor;
      filter: none;
    }
  }
}

.tech-main-container {
  min-width: 0;
  height: 100%;
  background: var(--surface-page);
}

.tech-header {
  flex-shrink: 0;
  height: var(--header-height);
  padding: 0 var(--space-lg);
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid var(--border-default);
  box-shadow: none;
  backdrop-filter: blur(12px);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: var(--space-md);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  min-width: 0;
}

.header-right {
  flex-shrink: 0;
}

.header-left {
  flex: 1;
}

.tech-collapse-btn,
.tech-action-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  box-shadow: none;
  transition: background-color var(--transition-fast), color var(--transition-fast);

  &::before,
  &::after {
    display: none;
  }

  &:hover {
    color: var(--text-primary);
    background: rgba(0, 0, 0, 0.05);
    border-color: transparent;
    box-shadow: none;
    transform: none;
  }
}

.tech-breadcrumb-section {
  flex: 1;
  min-width: 0;
  overflow: hidden;

  :deep(.el-breadcrumb) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :deep(.el-breadcrumb__inner),
  :deep(.el-breadcrumb__separator) {
    color: var(--text-muted);
    font-family: var(--font-family-base);
    font-weight: var(--font-weight-body);
  }
}

.tech-header-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.tech-user-section {
  flex-shrink: 0;
}

.tech-user-dropdown {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xxs) var(--space-xs);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

.notification-badge {
  background: var(--color-danger);
  color: var(--color-on-primary);
  border: 2px solid var(--color-canvas);
  box-shadow: none;
}

.user-avatar-wrapper :deep(.el-avatar) {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.user-name {
  color: var(--text-primary);
  font-family: var(--font-family-base);
  letter-spacing: 0;
}

.user-role,
.dropdown-arrow {
  color: var(--text-muted);
  font-family: var(--font-family-base);
  letter-spacing: 0;
}

.role-dot {
  background: var(--color-success);
  box-shadow: none;
}

.tech-main-content {
  flex: 1;
  min-height: 0;
  padding: 0;
  background: var(--surface-page);
  overflow: hidden;
}

.content-inner {
  width: min(100%, var(--content-max-width));
  height: 100%;
  padding: var(--space-md);
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
}

:global(.tech-lang-dropdown),
:global(.tech-user-dropdown-menu) {
  padding: var(--space-xxs);
  background: var(--color-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-overlay-elevated);
}

:global(.tech-user-dropdown-menu .el-dropdown-menu__item:hover),
:global(.tech-lang-dropdown .el-dropdown-menu__item:hover) {
  color: var(--color-primary);
  background: var(--color-info-soft);
}

.tech-page-transition-enter-active,
.tech-page-transition-leave-active {
  transition: opacity var(--transition-fast);
}

.tech-page-transition-enter-from,
.tech-page-transition-leave-to {
  opacity: 0;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .tech-page-transition-enter-active,
  .tech-page-transition-leave-active {
    transition: none;
  }
}

@media (max-width: 768px) {
  .tech-sidebar {
    position: relative;
  }

  .tech-header {
    padding: 0 var(--space-sm);
  }

  .btn-text {
    display: none;
  }

  .header-right {
    gap: var(--space-xxs);
  }
}
</style>
