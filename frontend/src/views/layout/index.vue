<template>
  <el-container class="tech-layout-container">
    <!-- 网格背景 -->
    <div class="tech-grid-bg"></div>

    <!-- 扫描线效果 -->
    <div class="scanline-effect"></div>

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
                    <stop stop-color="#33e0ff"/>
                    <stop offset="1" stop-color="#00c8d4"/>
                  </linearGradient>
                  <linearGradient id="techLogoGradient2" x1="33" y1="7.5" x2="45" y2="40.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#ff33ff"/>
                    <stop offset="1" stop-color="#d400d4"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="logo-glow"></div>
            <div class="logo-circuit"></div>
          </div>
          <div class="logo-text" v-show="!isCollapse">
            <h1 class="glitch-text" data-text="知阅阁">知阅阁</h1>
            <p>LIBRARY SYSTEM</p>
          </div>
        </div>

        <div class="tech-sidebar-divider" v-show="!isCollapse"></div>

        <!-- 导航菜单 -->
        <nav class="tech-sidebar-nav">
          <div class="nav-section">
            <p class="nav-section-title" v-show="!isCollapse">{{ t('layout.navigation') }}</p>
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
                <div class="tech-menu-divider" v-show="!isCollapse"></div>
                <p class="nav-section-title" v-show="!isCollapse">{{ t('layout.management') }}</p>

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

              <div class="tech-menu-divider" v-show="!isCollapse"></div>
              <p class="nav-section-title" v-show="!isCollapse">{{ t('layout.operations') }}</p>

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
                <div class="tech-menu-divider" v-show="!isCollapse"></div>
                <p class="nav-section-title" v-show="!isCollapse">{{ t('layout.analytics') }}</p>

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
            <button class="tech-collapse-btn" @click="isCollapse = !isCollapse">
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
            <!-- 时间显示 -->
            <div class="tech-time-display">
              <span class="current-time">{{ currentTime }}</span>
              <span class="current-date">{{ currentDate }}</span>
            </div>

            <div class="tech-header-actions">
              <el-dropdown @command="handleLanguageChange" trigger="click">
                <button class="tech-action-btn lang-btn">
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

              <button class="tech-action-btn notification-btn">
                <el-icon><Bell /></el-icon>
                <span class="notification-badge">3</span>
              </button>
            </div>

            <div class="tech-user-section">
              <el-dropdown @command="handleCommand" trigger="click">
                <div class="tech-user-dropdown">
                  <div class="user-avatar-wrapper">
                    <el-avatar :size="40" icon="UserFilled" :color="'#00f3ff'" />
                    <div class="avatar-ring"></div>
                  </div>
                  <div class="user-info" v-show="!isMobile">
                    <div class="user-name">{{ userStore.userInfo?.username || 'User' }}</div>
                    <div class="user-role">
                      <span class="role-dot"></span>
                      {{ userStore.isAdmin ? t('layout.admin') : t('layout.member') }}
                    </div>
                  </div>
                  <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu class="tech-user-dropdown-menu">
                    <div class="dropdown-header">
                      <div class="dropdown-avatar">
                        <el-avatar :size="48" icon="UserFilled" :color="'#00f3ff'" />
                      </div>
                      <div class="dropdown-user-info">
                        <div class="dropdown-user-name">{{ userStore.userInfo?.username || 'User' }}</div>
                        <div class="dropdown-user-role">{{ userStore.isAdmin ? t('layout.admin') : t('layout.member') }}</div>
                      </div>
                    </div>
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
        <div class="content-inner scanline">
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

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isCollapse = ref(false)
const isMobile = ref(false)
const currentTime = ref('')
const currentDate = ref('')
let timeInterval: number | null = null

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    isCollapse.value = true
  }
}

const updateDateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
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

  updateDateTime()
  timeInterval = window.setInterval(updateDateTime, 1000)

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
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style lang="scss" scoped>
.tech-layout-container {
  height: 100vh;
  background: linear-gradient(180deg, #050510 0%, #0a0a1a 50%, #101025 100%);
  position: relative;
}

// 网格背景
.tech-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 243, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 243, 255, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  z-index: 0;
}

// 扫描线效果
.scanline-effect {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      transparent,
      rgba(0, 243, 255, 0.08),
      transparent
    );
    animation: scanline 8s linear infinite;
  }
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

// 侧边栏
.tech-sidebar {
  background: linear-gradient(180deg, rgba(15, 15, 35, 0.98) 0%, rgba(10, 10, 26, 0.98) 100%);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid rgba(0, 243, 255, 0.15);
  overflow: hidden;
  position: relative;
  z-index: 5;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 0% 0%, rgba(0, 243, 255, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 100% 100%, rgba(255, 0, 255, 0.05) 0%, transparent 40%);
    pointer-events: none;
  }
}

.sidebar-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  padding: 24px 0;
}

// Logo 区域
.tech-logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 0 16px;
  margin-bottom: 8px;
  min-height: 64px;

  .logo-icon-wrapper {
    position: relative;
    width: 36px;
    height: 36px;
    flex-shrink: 0;

    .logo-icon {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 0 12px rgba(0, 243, 255, 0.4));
      animation: logo-float 3s ease-in-out infinite;
    }

    .logo-glow {
      position: absolute;
      inset: -10px;
      background: radial-gradient(circle, rgba(0, 243, 255, 0.25) 0%, transparent 70%);
      border-radius: 50%;
      animation: pulse-neon 2s ease-in-out infinite;
    }

    .logo-circuit {
      position: absolute;
      inset: -12px;
      border: 1px solid rgba(0, 243, 255, 0.15);
      border-radius: 50%;
      animation: circuit-rotate 12s linear infinite;

      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 5px;
        height: 5px;
        background: #00f3ff;
        border-radius: 50%;
        box-shadow: 0 0 6px #00f3ff;
      }

      &::before {
        top: -2px;
        left: 50%;
        transform: translateX(-50%);
      }

      &::after {
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  .logo-text {
    h1 {
      font-family: var(--font-family-base);
      font-size: 18px;
      font-weight: 700;
      color: #00f3ff;
      text-shadow: 0 0 10px #00f3ff, 0 0 20px #00f3ff;
      margin: 0;
      letter-spacing: 3px;
      line-height: 1.2;
      position: relative;
      display: inline-block;
    }

    p {
      font-family: var(--font-family-base);
      font-size: 10px;
      color: #8080a0;
      margin: 0;
      letter-spacing: 3px;
      text-transform: uppercase;
    }
  }
}

@keyframes logo-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes pulse-neon {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

@keyframes circuit-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// 侧边栏收缩状态下的样式优化
.tech-sidebar {
  &:has(.el-menu--collapse) {
    // Logo 区域优化
    .tech-logo-section {
      padding: 0 12px;
      justify-content: center;

      .logo-icon-wrapper {
        width: 32px;
        height: 32px;

        .logo-glow {
          inset: -8px;
        }

        .logo-circuit {
          inset: -10px;

          &::before,
          &::after {
            width: 4px;
            height: 4px;
          }

          &::before {
            top: -2px;
          }

          &::after {
            bottom: -2px;
          }
        }
      }
    }

    // 菜单导航区域（关键：限制宽度和溢出）
    .tech-sidebar-nav {
      padding: 8px 10px;
      width: 100%;
      overflow-x: hidden;

      .nav-section-title {
        display: none;
      }

      .nav-section {
        width: 100%;
      }

      .tech-menu-divider {
        margin: 8px 10px;
      }
    }

    // 菜单容器
    .tech-sidebar-menu {
      width: 100%;

      :deep(.el-menu-item) {
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: auto;
        max-width: 100%;
        box-sizing: border-box;

        // 覆盖 Element Plus tooltip 触发器样式
        .el-menu-tooltip__trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 48px;
          padding: 0;
          margin: 0 auto;
          position: relative;
        }

        .menu-icon {
          margin-right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        &.is-active::before {
          left: 6px;
        }
      }
    }

    // 隐藏底部主题切换区域并移除背景
    .sidebar-footer {
      display: none;
      visibility: hidden;
      height: 0;
      min-height: 0;
      max-height: 0;
      padding: 0;
      margin: 0;
      border-top: none;
      background: transparent;
      overflow: hidden;
      line-height: 0;
      font-size: 0;
    }
  }
}

// 故障文字效果
.glitch-text {
  position: relative;
  display: inline-block;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  color: #ff00ff;
  animation: glitch-1 2s infinite linear alternate-reverse;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.glitch-text::after {
  color: #00f3ff;
  animation: glitch-2 3s infinite linear alternate-reverse;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
}

@keyframes glitch-1 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-1px, 1px); }
  40% { transform: translate(-1px, -1px); }
  60% { transform: translate(1px, 1px); }
  80% { transform: translate(1px, -1px); }
}

@keyframes glitch-2 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(1px, -1px); }
  40% { transform: translate(1px, 1px); }
  60% { transform: translate(-1px, -1px); }
  80% { transform: translate(-1px, 1px); }
}

.tech-sidebar-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(0, 243, 255, 0.2), transparent);
  margin: 16px 24px;
}

.tech-sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 243, 255, 0.15);
    border-radius: 2px;
  }
}

.nav-section {
  .nav-section-title {
    font-family: var(--font-family-base);
    font-size: 10px;
    font-weight: 700;
    color: #606099;
    text-transform: uppercase;
    letter-spacing: 2px;
    padding: 16px 12px 8px;
    margin: 0;
  }
}

.tech-menu-divider {
  height: 1px;
  background: rgba(0, 243, 255, 0.08);
  margin: 12px 12px;
}

.tech-sidebar-menu {
  border: none;
  background: transparent;

  :deep(.el-menu-item) {
    height: 48px;
    line-height: 48px;
    margin: 4px 0;
    padding: 0 12px;
    border-radius: 12px;
    color: #b0b0d0;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      background: rgba(0, 243, 255, 0.08);
      color: #00f3ff;

      .menu-icon {
        filter: drop-shadow(0 0 8px #00f3ff);
      }
    }

    &.is-active {
      background: rgba(0, 243, 255, 0.12);
      color: #00f3ff;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 24px;
        background: linear-gradient(180deg, #ff00ff 0%, #00f3ff 100%);
        border-radius: 0 3px 3px 0;
        box-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
      }

      .menu-icon {
        filter: drop-shadow(0 0 10px #00f3ff);
      }
    }
  }

  .menu-icon {
    width: 20px;
    height: 20px;
    margin-right: 12px;
    transition: filter 0.2s ease;
  }

  .menu-text {
    font-family: var(--font-family-base);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
}

// 主容器
.tech-main-container {
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
  z-index: 1;
}

// 顶部导航
.tech-header {
  height: 72px;
  background: rgba(15, 15, 35, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 243, 255, 0.12);
  padding: 0;
  display: flex;
  align-items: center;
}

.header-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.tech-collapse-btn {
  width: 42px;
  height: 42px;
  border: 1px solid rgba(0, 243, 255, 0.15);
  background: rgba(20, 20, 40, 0.6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #8080a0;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(0, 243, 255, 0.4);
    background: rgba(0, 243, 255, 0.08);
    color: #00f3ff;
  }
}

.tech-breadcrumb-section {
  :deep(.el-breadcrumb__inner) {
    font-family: var(--font-family-base);
    font-size: 14px;
    color: #606099;

    &.is-link {
      color: #b0b0d0;

      &:hover {
        color: #00f3ff;
      }
    }
  }

  :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
    color: #e0e0ff;
    font-weight: 600;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

// 时间显示
.tech-time-display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 20px;
  border-right: 1px solid rgba(0, 243, 255, 0.1);

  .current-time {
    font-family: var(--font-family-base);
    font-size: 18px;
    font-weight: 700;
    color: #00f3ff;
    text-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
    line-height: 1.2;
  }

  .current-date {
    font-family: var(--font-family-base);
    font-size: 12px;
    color: #606099;
    line-height: 1.2;
  }
}

.tech-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tech-action-btn {
  width: 44px;
  height: 44px;
  border: 1px solid rgba(0, 243, 255, 0.1);
  background: rgba(20, 20, 40, 0.4);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #8080a0;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: rgba(0, 243, 255, 0.3);
    background: rgba(0, 243, 255, 0.06);
    color: #00f3ff;
  }

  &.lang-btn {
    width: auto;
    padding: 0 14px;
    gap: 6px;

    .btn-text {
      font-family: var(--font-family-base);
      font-size: 13px;
      font-weight: 600;
    }
  }
}

.notification-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: linear-gradient(135deg, #ff3366 0%, #d42a55 100%);
  color: white;
  font-family: var(--font-family-base);
  font-size: 10px;
  font-weight: 700;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(255, 51, 102, 0.4);
}

.tech-lang-dropdown {
  :deep(.el-dropdown-menu__item) {
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-family-base);
    font-size: 14px;
    color: #b0b0d0;
    background: rgba(15, 15, 35, 0.95);

    &.active {
      color: #00f3ff;
      background: rgba(0, 243, 255, 0.08);
    }

    &:hover {
      background: rgba(0, 243, 255, 0.06);
    }
  }

  .lang-flag {
    font-size: 18px;
  }
}

.tech-user-section {
  .tech-user-dropdown {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(20, 20, 40, 0.4);
    border: 1px solid rgba(0, 243, 255, 0.1);

    &:hover {
      border-color: rgba(0, 243, 255, 0.3);
      background: rgba(0, 243, 255, 0.06);
    }
  }

  .user-avatar-wrapper {
    position: relative;
    flex-shrink: 0;

    .avatar-ring {
      position: absolute;
      inset: -3px;
      border: 2px solid transparent;
      border-radius: 50%;
      background: linear-gradient(135deg, #00f3ff, #ff00ff) border-box;
      -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    &:hover .avatar-ring {
      opacity: 1;
    }
  }

  .user-info {
    text-align: left;

    .user-name {
      font-family: var(--font-family-base);
      font-size: 14px;
      font-weight: 600;
      color: #e0e0ff;
      line-height: 1.3;
    }

    .user-role {
      font-family: var(--font-family-base);
      font-size: 12px;
      color: #606099;
      line-height: 1.3;
      display: flex;
      align-items: center;
      gap: 6px;

      .role-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #00ff88;
        box-shadow: 0 0 6px #00ff88;
      }
    }
  }

  .dropdown-arrow {
    color: #606099;
    font-size: 14px;
    transition: transform 0.2s ease;
  }
}

.tech-user-dropdown-menu {
  padding: 8px;
  background: rgba(15, 15, 35, 0.95);
  border: 1px solid rgba(0, 243, 255, 0.15);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);

  :deep(.el-dropdown-menu__item) {
    border-radius: 8px;
    padding: 10px 14px;
    margin: 2px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-family-base);
    font-size: 14px;
    color: #b0b0d0;

    &:hover {
      color: #e0e0ff;
      background: rgba(0, 243, 255, 0.06);
    }

    &.logout-item {
      color: #ff3366;

      &:hover {
        background: rgba(255, 51, 102, 0.08);
      }
    }
  }
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  margin: -8px -8px 8px;
  border-bottom: 1px solid rgba(0, 243, 255, 0.12);
  background: linear-gradient(135deg, rgba(0, 243, 255, 0.05) 0%, rgba(255, 0, 255, 0.03) 100%);
}

.dropdown-avatar {
  flex-shrink: 0;
}

.dropdown-user-info {
  .dropdown-user-name {
    font-family: var(--font-family-base);
    font-size: 15px;
    font-weight: 700;
    color: #e0e0ff;
    line-height: 1.3;
  }

  .dropdown-user-role {
    font-family: var(--font-family-base);
    font-size: 13px;
    color: #606099;
    line-height: 1.3;
  }
}

.tech-main-content {
  padding: 0;
  overflow: hidden;
  flex: 1;
}

.content-inner {
  height: 100%;
  overflow-y: auto;
  padding: 32px;
  position: relative;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 243, 255, 0.15);
    border-radius: 4px;

    &:hover {
      background: rgba(0, 243, 255, 0.25);
    }
  }
}

// 页面切换动画
.tech-page-transition {
  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease;
  }

  &-enter-from {
    opacity: 0;
    transform: translateY(16px);
    filter: blur(4px);
  }

  &-leave-to {
    opacity: 0;
    transform: translateY(-8px);
    filter: blur(4px);
  }
}

// 响应式
@media (max-width: 768px) {
  .header-inner {
    padding: 0 16px;
  }

  .content-inner {
    padding: 20px;
  }

  .tech-breadcrumb-section {
    display: none;
  }

  .user-info {
    display: none;
  }

  .tech-time-display {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
/* Notion-style application shell. Legacy class names remain as stable hooks. */
.tech-layout-container {
  min-height: 100vh;
  background: var(--surface-page);
  color: var(--text-primary);
}

.tech-grid-bg,
.scanline-effect,
.logo-glow,
.logo-circuit,
.avatar-ring {
  display: none;
}

.tech-sidebar {
  background: var(--color-canvas);
  border-right: 1px solid var(--border-default);
  box-shadow: none;
  transition: width var(--transition-base);

  &::before {
    display: none;
  }
}

.sidebar-inner {
  padding: var(--space-sm) var(--space-xs);
}

.tech-logo-section {
  justify-content: flex-start;
  min-height: 48px;
  margin: 0 0 var(--space-md);
  padding: 0 var(--space-xs);
  gap: var(--space-sm);

  .logo-icon-wrapper {
    width: 32px;
    height: 32px;

    .logo-icon {
      filter: none;
      animation: none;
    }
  }

  .logo-text {
    h1 {
      font-family: var(--font-family-base);
      font-size: var(--font-size-body-md);
      font-weight: var(--font-weight-heading);
      line-height: 1.2;
      color: var(--text-primary);
      text-shadow: none;
      letter-spacing: 0;
    }

    p {
      margin-top: 2px;
      font-family: var(--font-family-base);
      font-size: 10px;
      color: var(--text-placeholder);
      letter-spacing: 0;
    }
  }
}

.glitch-text::before,
.glitch-text::after {
  display: none;
}

.tech-sidebar-divider,
.tech-menu-divider {
  height: 1px;
  margin: var(--space-xs);
  background: var(--border-default);
  box-shadow: none;
}

.tech-sidebar-nav {
  padding: 0;
}

.nav-section-title {
  margin: var(--space-md) var(--space-sm) var(--space-xxs);
  font-family: var(--font-family-base);
  font-size: var(--font-size-eyebrow);
  font-weight: var(--font-weight-title);
  color: var(--text-placeholder);
  letter-spacing: 0.125px;
  text-transform: none;
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
  background: var(--surface-page);
}

.tech-header {
  height: var(--header-height);
  padding: 0 var(--space-lg);
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid var(--border-default);
  box-shadow: none;
  backdrop-filter: blur(12px);
}

.header-inner {
  height: 100%;
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
  :deep(.el-breadcrumb__inner),
  :deep(.el-breadcrumb__separator) {
    color: var(--text-muted);
    font-family: var(--font-family-base);
    font-weight: var(--font-weight-body);
  }
}

.tech-time-display {
  padding-right: var(--space-md);
  border-right: 1px solid var(--border-default);

  .current-time,
  .current-date {
    font-family: var(--font-family-base);
    color: var(--text-muted);
    letter-spacing: 0;
  }
}

.notification-badge {
  background: var(--color-danger);
  color: var(--color-on-primary);
  border: 2px solid var(--color-canvas);
  box-shadow: none;
}

.tech-user-dropdown {
  padding: var(--space-xxs) var(--space-xs);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

.user-avatar-wrapper :deep(.el-avatar) {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.user-name,
.dropdown-user-name {
  color: var(--text-primary);
  font-family: var(--font-family-base);
  letter-spacing: 0;
}

.user-role,
.dropdown-user-role,
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
  padding: 0;
  background: var(--surface-page);
}

.content-inner {
  width: min(100%, var(--content-max-width));
  min-height: calc(100vh - var(--header-height));
  margin: 0 auto;
}

:global(.tech-lang-dropdown),
:global(.tech-user-dropdown-menu) {
  padding: var(--space-xxs);
  background: var(--color-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-overlay-elevated);
}

:global(.tech-user-dropdown-menu .dropdown-header) {
  background: var(--color-canvas-soft);
  border-bottom-color: var(--border-default);
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

@media (max-width: 768px) {
  .tech-sidebar {
    position: relative;
  }

  .tech-header {
    padding: 0 var(--space-sm);
  }

  .tech-time-display,
  .btn-text {
    display: none;
  }

  .header-right {
    gap: var(--space-xxs);
  }
}
</style>
