<template>
  <div class="tech-login-container">
    <!-- 动态粒子背景 -->
    <div class="particle-bg" ref="particleRef"></div>

    <!-- 网格背景 -->
    <div class="tech-grid-bg"></div>

    <!-- 全息投影效果 -->
    <div class="hologram-effect"></div>

    <!-- 扫描线效果 -->
    <div class="scanline-effect"></div>

    <div class="login-wrapper">
      <!-- 中央登录卡片 -->
      <div class="login-card login-card--editorial">
        <!-- 顶部LOGO区域 -->
        <div class="card-header">
          <div class="logo-container">
            <div class="logo-icon">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12C8 10.8954 8.89543 10 10 10H36C37.1046 10 38 10.8954 38 12V44C38 45.1046 37.1046 46 36 46H10C8.89543 46 8 45.1046 8 44V12Z" fill="url(#tech-primary-gradient)"/>
                <path d="M42 14C42 12.8954 42.8954 12 44 12H54C55.1046 12 56 12.8954 56 14V50C56 51.1046 55.1046 52 54 52H44C42.8954 52 42 51.1046 42 50V14Z" fill="url(#tech-secondary-gradient)"/>
                <path d="M14 18H32V20H14V18ZM14 24H32V26H14V24ZM14 30H32V32H14V30ZM14 36H26V38H14V36Z" fill="white"/>
                <defs>
                  <linearGradient id="tech-primary-gradient" x1="8" y1="10" x2="38" y2="46" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#33e0ff"/>
                    <stop offset="1" stop-color="#00c8d4"/>
                  </linearGradient>
                  <linearGradient id="tech-secondary-gradient" x1="42" y1="12" x2="56" y2="52" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#ff33ff"/>
                    <stop offset="1" stop-color="#d400d4"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="logo-ring"></div>
            <div class="logo-pulse"></div>
          </div>
          <h1 class="system-title">知阅阁</h1>
          <p class="system-subtitle">LIBRARY MANAGEMENT SYSTEM</p>
        </div>

        <!-- 登录表单区域 -->
        <div class="card-body">
          <div class="welcome-text">
            <span class="typing-text">{{ typingText }}</span>
            <span class="blink-cursor">|</span>
          </div>

          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            class="login-form"
            @submit.prevent="handleLogin"
          >
            <el-form-item prop="username" :error="loginErrors.username">
              <div class="field-label">
                <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>用户名</span>
              </div>
              <div class="input-wrapper">
                <div class="input-border"></div>
                <el-input
                  v-model="form.username"
                  placeholder="请输入用户名"
                  class="tech-input"
                  @input="loginErrors.username = ''"
                />
              </div>
            </el-form-item>

            <el-form-item prop="password" :error="loginErrors.password">
              <div class="field-label">
                <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>密&nbsp;&nbsp;&nbsp;&nbsp;码</span>
              </div>
              <div class="input-wrapper">
                <div class="input-border"></div>
                <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="请输入密码"
                  show-password
                  class="tech-input"
                  @input="loginErrors.password = ''"
                  @keyup.enter="handleLogin"
                />
              </div>
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
              <button type="button" class="forgot-link" @click="showForgotDialog = true">忘记密码？</button>
            </div>

            <button
              type="button"
              class="login-button"
              :disabled="loading"
              @click="handleLogin"
            >
              <span v-if="!loading" class="btn-content">
                <span class="btn-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </span>
                <span class="btn-text">接入系统</span>
                <span class="btn-glow"></span>
              </span>
              <span v-else class="loading-content">
                <span class="spinner"></span>
                验证中...
              </span>
            </button>
          </el-form>

          <div class="register-section">
            <span>还没有账号？</span>
            <button type="button" class="register-link" @click="showRegisterDialog = true">立即注册</button>
          </div>
        </div>

        <!-- 底部装饰 -->
        <div class="card-footer">
          <div class="security-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>安全加密连接 · 企业级防护</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 注册弹窗 -->
    <el-dialog
      v-model="showRegisterDialog"
      :title="''"
      width="480px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>用户注册</h3>
          <p>创建新账户，接入数字知识网络</p>
        </div>

        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="register-form"
        >
          <el-form-item prop="username">
            <div class="field-label">
              <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>用户名</span>
            </div>
            <div class="input-wrapper">
              <div class="input-border"></div>
              <el-input v-model="registerForm.username" placeholder="请输入用户名" />
            </div>
          </el-form-item>

          <el-form-item prop="password">
            <div class="field-label">
              <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>密&nbsp;&nbsp;&nbsp;&nbsp;码</span>
            </div>
            <div class="input-wrapper">
              <div class="input-border"></div>
              <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password />
            </div>
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <div class="field-label">
              <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>确认密码</span>
            </div>
            <div class="input-wrapper">
              <div class="input-border"></div>
              <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" show-password @keyup.enter="handleRegister" />
            </div>
          </el-form-item>
        </el-form>

        <div class="dialog-footer">
          <button class="cancel-btn" @click="showRegisterDialog = false">
            取消
          </button>
          <button class="confirm-btn" :disabled="registerLoading" @click="handleRegister">
            <span v-if="!registerLoading">注册</span>
            <span v-else>创建中...</span>
          </button>
        </div>
      </div>
    </el-dialog>

    <!-- 忘记密码弹窗 -->
    <el-dialog
      v-model="showForgotDialog"
      :title="''"
      width="480px"
      :close-on-click-modal="false"
      class="tech-dialog"
    >
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>找回密码</h3>
          <p>请联系系统管理员重置密码</p>
        </div>
        <div class="forgot-content">
          <div class="contact-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>管理员电话：138-XXXX-XXXX</span>
          </div>
          <div class="contact-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>管理员邮箱：admin@library.com</span>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="confirm-btn full-width" @click="showForgotDialog = false">
            我知道了
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, FormInstance, FormRules, ElCheckbox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { register } from '@/api/auth/index'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const showRegisterDialog = ref(false)
const showForgotDialog = ref(false)
const registerFormRef = ref<FormInstance>()
const registerLoading = ref(false)
const particleRef = ref<HTMLElement>()
const rememberMe = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const loginErrors = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

// 打字机效果
const typingText = ref('')
const fullText = '欢迎接入数字知识管理系统'
let typingIndex = 0
let typingInterval: number | null = null

const rules: FormRules = {
  username: [
    { required: true, message: t('login.usernameRequired'), trigger: 'blur' },
    { min: 3, max: 50, message: t('login.usernameLength'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('login.passwordRequired'), trigger: 'blur' },
    { min: 6, max: 100, message: t('login.passwordLength'), trigger: 'blur' }
  ]
}

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== registerForm.password) {
    callback(new Error(t('login.passwordMismatch')))
  } else {
    callback()
  }
}

const registerRules: FormRules = {
  username: [
    { required: true, message: t('login.usernameRequired'), trigger: 'blur' },
    { min: 3, max: 50, message: t('login.usernameLength'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('login.passwordRequired'), trigger: 'blur' },
    { min: 6, max: 100, message: t('login.passwordLength'), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: t('login.confirmPassword'), trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 创建粒子背景
const createParticles = () => {
  if (!particleRef.value) return

  const container = particleRef.value
  const particleCount = 60

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    particle.style.left = Math.random() * 100 + '%'
    particle.style.top = Math.random() * 100 + '%'
    particle.style.animationDelay = Math.random() * 5 + 's'
    particle.style.opacity = (Math.random() * 0.6 + 0.2).toString()

    const size = Math.random() * 3 + 1
    particle.style.width = size + 'px'
    particle.style.height = size + 'px'

    container.appendChild(particle)
  }
}

// 打字机动画
const startTyping = () => {
  typingInterval = window.setInterval(() => {
    if (typingIndex < fullText.length) {
      typingText.value += fullText[typingIndex]
      typingIndex++
    } else {
      if (typingInterval) {
        clearInterval(typingInterval)
      }
    }
  }, 100)
}

const handleLogin = async () => {
  if (!formRef.value) return

  loginErrors.username = form.username.trim() ? '' : t('login.usernameRequired')
  loginErrors.password = form.password ? '' : t('login.passwordRequired')

  if (loginErrors.username || loginErrors.password) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      userStore.logoutAction()
      await userStore.loginAction(form)
      ElMessage.success('接入成功')
      router.push('/')
    } catch (error: any) {
      ElMessage.error(error.message || t('login.failed'))
    } finally {
      loading.value = false
    }
  })
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate(async (valid) => {
    if (!valid) return

    registerLoading.value = true
    try {
      await register({
        username: registerForm.username,
        password: registerForm.password
      })
      ElMessage.success(t('login.registerSuccess'))
      showRegisterDialog.value = false
      registerFormRef.value?.resetFields()
      form.username = registerForm.username
    } catch (error: any) {
      ElMessage.error(error.message || t('login.registerFailed'))
    } finally {
      registerLoading.value = false
    }
  })
}

onMounted(() => {
  nextTick(() => {
    createParticles()
    startTyping()
  })
})

onUnmounted(() => {
  if (typingInterval) {
    clearInterval(typingInterval)
  }
})
</script>

<style lang="scss" scoped>
@media not all {
.tech-login-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 20% 20%, rgba(0, 243, 255, 0.08) 0%, transparent 25%),
    radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.08) 0%, transparent 25%),
    linear-gradient(135deg, #080818 0%, #0d0d25 50%, #121230 100%);
}

// 粒子背景
.particle-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  background: #00f3ff;
  border-radius: 50%;
  animation: float 8s ease-in-out infinite;
  box-shadow: 0 0 6px #00f3ff;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.4;
  }
  25% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-40px) translateX(-10px);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-20px) translateX(5px);
    opacity: 0.8;
  }
}

// 网格背景
.tech-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
  perspective: 1000px;
  transform: rotateX(60deg);
}

// 全息投影效果
.hologram-effect {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(0, 243, 255, 0.05) 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
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
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 243, 255, 0.2),
      rgba(255, 0, 255, 0.2),
      transparent
    );
    animation: scanline 6s linear infinite;
  }
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.login-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
}

.login-card {
  width: 100%;
  max-width: 480px;
  background: rgba(15, 15, 35, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(0, 243, 255, 0.2);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(0, 243, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
  animation: cardAppear 0.6s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #00f3ff, #ff33ff, #00ff88, #00f3ff);
    background-size: 300% 100%;
    animation: gradientShift 3s linear infinite;
  }
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}

// 头部区域
.card-header {
  text-align: center;
  padding: 25px 30px 15px;
  position: relative;
}

.logo-container {
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
}

.system-title {
  font-size: 26px;
  margin-bottom: 4px;
}

.system-subtitle {
  font-size: 11px;
  letter-spacing: 3px;
}

.logo-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
}

.logo-icon {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 3;
  filter: drop-shadow(0 0 20px rgba(0, 243, 255, 0.5));
  animation: logoFloat 3s ease-in-out infinite;
}

.logo-ring {
  position: absolute;
  inset: -8px;
  border: 2px solid rgba(0, 243, 255, 0.3);
  border-radius: 50%;
  z-index: 2;
  animation: ringRotate 6s linear infinite;
}

.logo-pulse {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(0, 243, 255, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ringPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

.system-title {
  font-family: var(--font-family-base);
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 8px 0;
  letter-spacing: 4px;
  background: linear-gradient(135deg, #00f3ff 0%, #33e0ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(0, 243, 255, 0.3);
}

.system-subtitle {
  font-family: var(--font-family-base);
  font-size: 12px;
  color: #8080a0;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin: 0;
  font-weight: 500;
}

// 表单区域
.card-body {
  padding: 0 30px 20px;
}

.welcome-text {
  text-align: center;
  margin-bottom: 20px;
  font-size: 13px;
  color: #b0b0d0;
  height: 18px;
}

.typing-text {
  font-family: var(--font-family-base);
}

.blink-cursor {
  color: #00f3ff;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}

.login-form {
  .form-field {
    margin-bottom: 14px;

    .field-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-family-base);
      font-size: 11px;
      font-weight: 600;
      color: #b0b0d0;
      margin-bottom: 6px;
      letter-spacing: 1px;
      text-transform: uppercase;

      .label-icon {
        width: 12px;
        height: 12px;
        color: #00f3ff;
      }
    }

    .input-wrapper {
      position: relative;
      width: 100%;
    }

    .input-border {
      position: absolute;
      inset: 0;
      border: 2px solid rgba(0, 243, 255, 0.2);
      border-radius: 10px;
      transition: all 0.3s ease;
      pointer-events: none;
    }

    .input-wrapper:hover .input-border {
      border-color: rgba(0, 243, 255, 0.4);
    }

    .input-wrapper:focus-within .input-border {
      border-color: #00f3ff;
      box-shadow:
        0 0 0 3px rgba(0, 243, 255, 0.1),
        0 0 20px rgba(0, 243, 255, 0.2);
    }

    :deep(.el-input__wrapper) {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      padding: 8px 14px !important;
      background: rgba(20, 20, 40, 0.6) !important;
      border-radius: 10px !important;
    }

    :deep(.el-input__inner) {
      background: transparent !important;
      color: #e0e0ff !important;
      font-family: var(--font-family-base);
      font-size: 14px !important;
      font-weight: 500;

      &::placeholder {
        color: #606099 !important;
        font-weight: 400;
        font-size: 13px !important;
      }
    }
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 12px;
  color: #b0b0d0;

  :deep(.el-checkbox__label) {
    color: #b0b0d0 !important;
  }

  .forgot-link {
    color: #00f3ff;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: #33e0ff;
      text-shadow: 0 0 8px rgba(0, 243, 255, 0.5);
    }
  }
}

.login-button {
  width: 100%;
  height: 40px;
  font-family: var(--font-family-base);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #000;
  background: linear-gradient(135deg, #00f3ff 0%, #00c8d4 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow:
    0 4px 16px rgba(0, 243, 255, 0.3),
    0 0 30px rgba(0, 243, 255, 0.1);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow:
      0 8px 24px rgba(0, 243, 255, 0.4),
      0 0 40px rgba(0, 243, 255, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
    z-index: 2;
  }

  .btn-icon {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }

  &:hover .btn-icon {
    transform: translateX(4px);
  }

  .btn-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transition: all 0.5s ease;
  }

  &:hover .btn-glow {
    width: 100%;
    height: 200%;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.register-section {
  text-align: center;
  font-size: 12px;
  color: #b0b0d0;
  margin-bottom: 0;

  .register-link {
    color: #00f3ff;
    font-weight: 600;
    cursor: pointer;
    margin-left: 4px;
    transition: all 0.2s ease;

    &:hover {
      color: #33e0ff;
      text-shadow: 0 0 8px rgba(0, 243, 255, 0.5);
    }
  }
}

// 底部区域
.card-footer {
  padding: 6px 30px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(0, 243, 255, 0.1);
}

.security-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  color: #606099;

  svg {
    width: 12px;
    height: 12px;
    color: #00ff88;
  }
}

// 动态光效背景
.tech-login-container::before,
.tech-login-container::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
}

.tech-login-container::before {
  background: #00f3ff;
  top: -200px;
  left: -200px;
  animation: floatGlow 20s ease-in-out infinite;
}

.tech-login-container::after {
  background: #ff33ff;
  bottom: -200px;
  right: -200px;
  animation: floatGlow 20s ease-in-out infinite reverse;
}

@keyframes floatGlow {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, 50px) scale(1.1);
  }
  66% {
    transform: translate(-30px, 30px) scale(0.9);
  }
}

// 弹窗样式
:deep(.tech-dialog) {
  .el-dialog {
    background: rgba(15, 15, 35, 0.95) !important;
    border: 1px solid rgba(0, 243, 255, 0.2) !important;
    border-radius: 20px !important;
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.6),
      0 0 40px rgba(0, 243, 255, 0.1) !important;
  }

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0 !important;
  }
}

.dialog-content {
  padding: 32px;

  .dialog-header {
    text-align: center;
    margin-bottom: 28px;

    h3 {
      font-family: var(--font-family-base);
      font-size: 24px;
      font-weight: 700;
      color: #e0e0ff;
      margin: 0 0 8px 0;
      letter-spacing: 2px;
    }

    p {
      font-family: var(--font-family-base);
      font-size: 13px;
      color: #8080a0;
      margin: 0;
    }
  }

  .register-form {
    .form-field {
      margin-bottom: 20px;

      .field-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-family-base);
        font-size: 12px;
        font-weight: 600;
        color: #b0b0d0;
        margin-bottom: 8px;
        letter-spacing: 1px;
        text-transform: uppercase;

        .label-icon {
          width: 14px;
          height: 14px;
          color: #00f3ff;
        }
      }

      .input-wrapper {
        position: relative;
        width: 100%;
      }

      .input-border {
        position: absolute;
        inset: 0;
        border: 2px solid rgba(0, 243, 255, 0.2);
        border-radius: 10px;
        transition: all 0.3s ease;
        pointer-events: none;
      }

      .input-wrapper:hover .input-border {
        border-color: rgba(0, 243, 255, 0.4);
      }

      .input-wrapper:focus-within .input-border {
        border-color: #00f3ff;
        box-shadow:
          0 0 0 3px rgba(0, 243, 255, 0.1),
          0 0 20px rgba(0, 243, 255, 0.2);
      }

      :deep(.el-input__wrapper) {
        background: rgba(20, 20, 40, 0.6) !important;
        border: none !important;
        box-shadow: none !important;
        padding: 10px 14px !important;
        border-radius: 10px !important;
      }

      :deep(.el-input__inner) {
        background: transparent !important;
        color: #e0e0ff !important;
        font-family: var(--font-family-base);
        font-size: 14px !important;

        &::placeholder {
          color: #606099 !important;
          font-size: 13px !important;
        }
      }
    }
  }

  .forgot-content {
    padding: 20px 0;

    .contact-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      background: rgba(20, 20, 40, 0.6);
      border-radius: 10px;
      margin-bottom: 12px;
      color: #b0b0d0;
      font-size: 14px;

      svg {
        width: 20px;
        height: 20px;
        color: #00f3ff;
        flex-shrink: 0;
      }
    }
  }

  .dialog-footer {
    display: flex;
    gap: 12px;
    margin-top: 28px;

    .cancel-btn,
    .confirm-btn {
      flex: 1;
      height: 44px;
      font-family: var(--font-family-base);
      font-size: 13px !important;
      font-weight: 700 !important;
      border-radius: 8px !important;
      transition: all 0.2s ease !important;
      letter-spacing: 1px;
      cursor: pointer;
      border: none;
    }

    .cancel-btn {
      background: transparent;
      border: 2px solid rgba(0, 243, 255, 0.3);
      color: #b0b0d0;

      &:hover {
        border-color: #00f3ff;
        color: #00f3ff;
        background: rgba(0, 243, 255, 0.1);
      }
    }

    .confirm-btn {
      background: linear-gradient(135deg, #ff33ff 0%, #d400d4 100%);
      color: #fff;
      box-shadow: 0 4px 16px rgba(255, 0, 255, 0.3);

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 0, 255, 0.4);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      &.full-width {
        flex: none;
        width: 100%;
      }
    }
  }
}

// 响应式
@media (max-width: 576px) {
  .login-card {
    max-width: 100%;
  }

  .system-title {
    font-size: 28px;
  }

  .card-header {
    padding: 30px 20px 20px;
  }

  .card-body {
    padding: 0 20px 20px;
  }

  .card-footer {
    padding: 12px 20px;
  }

  .dialog-content {
    padding: 24px 20px;
  }
}
}
</style>

<style lang="scss" scoped>
.tech-login-container {
  position: relative;
  display: grid;
  min-height: 100vh;
  min-height: 100dvh;
  padding: clamp(var(--space-md), 4vw, 48px);
  place-items: center;
  color: var(--text-primary);
  background: var(--color-canvas-soft);
  overflow-x: hidden;
}

.particle-bg,
.tech-grid-bg,
.hologram-effect,
.scanline-effect {
  display: none;
}

.login-wrapper {
  position: relative;
  z-index: 1;
  width: min(100%, 1040px);
}

.login-card {
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-elevated);
  animation: notion-login-enter var(--duration-slow) var(--ease-standard) both;
}

.login-card--editorial {
  display: grid;
  grid-template-columns: minmax(0, 42fr) minmax(0, 58fr);
  grid-template-areas:
    'brand form'
    'brand footer';
  grid-template-rows: 1fr auto;
  min-height: 620px;
}

@keyframes notion-login-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  position: relative;
  display: flex;
  grid-area: brand;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  padding: 48px;
  color: var(--text-on-inverted);
  text-align: left;
  background: var(--color-secondary);
  isolation: isolate;
}

.card-header::before {
  position: absolute;
  right: -38px;
  bottom: 48px;
  z-index: -1;
  width: 240px;
  height: 168px;
  content: '';
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
  box-shadow:
    -18px 18px 0 -17px rgba(255, 255, 255, 0.13),
    -36px 36px 0 -35px rgba(255, 255, 255, 0.1);
  transform: rotate(-7deg);
}

.card-header::after {
  position: absolute;
  right: 48px;
  bottom: 48px;
  width: 64px;
  height: 8px;
  content: '';
  background: var(--color-accent-pink);
  border-radius: var(--radius-xs);
  box-shadow:
    -80px 0 0 var(--color-accent-sky),
    -160px 0 0 var(--color-accent-green);
}

.logo-container {
  position: relative;
  width: 56px;
  height: 56px;
  margin: 0 0 var(--space-lg);
  padding: var(--space-xs);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
}

.logo-icon {
  width: 100%;
  height: 100%;
}

.logo-ring,
.logo-pulse {
  display: none;
}

.system-title {
  margin: 0;
  color: var(--text-on-inverted);
  font-family: var(--font-family-base);
  font-size: var(--font-size-heading-1);
  font-weight: var(--font-weight-heading);
  line-height: var(--line-height-heading-1);
  letter-spacing: 0;
  text-shadow: none;
}

.system-subtitle {
  max-width: 250px;
  margin-top: var(--space-xs);
  color: rgba(255, 255, 255, 0.64);
  font-family: var(--font-family-base);
  font-size: var(--font-size-eyebrow);
  line-height: var(--line-height-body-md);
  letter-spacing: 0;
}

.card-body {
  display: flex;
  grid-area: form;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 48px 56px var(--space-xxl);
}

.welcome-text {
  min-height: 24px;
  margin-bottom: var(--space-lg);
  color: var(--text-secondary);
  font-size: var(--font-size-body-md);
  text-align: left;
}

.blink-cursor {
  display: none;
}

.login-form {
  display: grid;
  gap: var(--space-md);
}

.login-form :deep(.el-form-item),
.register-form :deep(.el-form-item) {
  width: 100%;
}

.field-label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-xs);
  color: var(--text-primary);
  font-family: var(--font-family-base);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-title);
  letter-spacing: 0;
}

.label-icon {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-border {
  display: none;
}

.tech-input,
.register-form :deep(.el-input) {
  width: 100%;
}

:deep(.el-input__wrapper) {
  min-height: var(--control-height-lg);
  padding: 0 var(--space-sm);
  background: var(--surface-control);
  border-radius: var(--radius-xs);
  box-shadow: 0 0 0 1px var(--border-default) inset;
  transition: box-shadow var(--transition-fast), background-color var(--transition-fast);
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--color-ink-faint) inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--color-primary) inset, var(--shadow-focus);
}

:deep(.el-input__inner) {
  color: var(--text-primary);
  font-size: var(--font-size-body-sm);
}

:deep(.el-input__inner::placeholder) {
  color: var(--text-placeholder);
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  color: var(--text-muted);
  font-size: var(--font-size-caption);
}

.forgot-link,
.register-link {
  display: inline-flex;
  align-items: center;
  min-height: var(--control-height-lg);
  padding: 0 var(--space-xs);
  color: var(--color-primary);
  font: inherit;
  background: transparent;
  border: 0;
  cursor: pointer;
  border-radius: var(--radius-xs);
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.forgot-link:hover,
.register-link:hover {
  color: var(--color-primary-active);
}

.login-button,
.confirm-btn,
.cancel-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--control-height-lg);
  padding: 0 20px;
  border-radius: var(--radius-md);
  font-family: var(--font-family-base);
  font-size: var(--font-size-button);
  font-weight: var(--font-weight-button);
  letter-spacing: 0;
  cursor: pointer;
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.login-button,
.confirm-btn {
  width: 100%;
  color: var(--color-on-primary);
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.login-button:hover,
.confirm-btn:hover {
  background: var(--color-primary-active);
  border-color: var(--color-primary-active);
}

.login-button:active:not(:disabled),
.confirm-btn:active:not(:disabled) {
  background: var(--color-primary-active);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.16);
}

.login-button:disabled,
.confirm-btn:disabled {
  cursor: not-allowed;
  opacity: var(--disabled-opacity);
}

.btn-content,
.loading-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.btn-glow {
  display: none;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: var(--color-on-primary);
  border-radius: 50%;
  animation: notion-login-spin 0.8s linear infinite;
}

@keyframes notion-login-spin {
  to { transform: rotate(360deg); }
}

.register-section {
  margin-top: var(--space-md);
  color: var(--text-muted);
  font-size: var(--font-size-caption);
  text-align: center;
}

.card-footer {
  grid-area: footer;
  padding: var(--space-sm) var(--space-lg);
  color: var(--text-muted);
  background: var(--color-surface);
  border-top: 1px solid var(--border-default);
}

.security-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  font-size: var(--font-size-eyebrow);
}

.security-info svg {
  width: 14px;
  height: 14px;
}

.login-button:focus-visible,
.forgot-link:focus-visible,
.register-link:focus-visible,
.cancel-btn:focus-visible,
.confirm-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

:global(.tech-dialog.el-dialog) {
  width: min(480px, calc(100vw - 32px));
}

.dialog-content {
  color: var(--text-primary);
}

.dialog-header {
  margin-bottom: var(--space-lg);
}

.dialog-header h3 {
  margin: 0;
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-title);
}

.dialog-header p {
  margin: var(--space-xxs) 0 0;
  color: var(--text-muted);
  font-size: var(--font-size-caption);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-xs);
  margin-top: var(--space-lg);
}

.dialog-footer .confirm-btn,
.dialog-footer .cancel-btn {
  width: auto;
  min-width: 88px;
}

.cancel-btn {
  color: var(--text-primary);
  background: var(--color-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
}

.cancel-btn:hover {
  background: var(--color-canvas-soft);
  border-color: var(--color-ink-faint);
}

.forgot-content,
.contact-info {
  color: var(--text-secondary);
}

.forgot-content {
  display: grid;
  gap: var(--space-xs);
}

.contact-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--color-canvas-soft);
  border-radius: var(--radius-md);
}

.contact-info svg {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}

@media (max-width: 900px) {
  .login-card--editorial {
    grid-template-columns: minmax(0, 38fr) minmax(0, 62fr);
  }

  .card-header {
    padding: var(--space-xxl);
  }

  .card-body {
    padding-right: var(--space-xxl);
    padding-left: var(--space-xxl);
  }
}

@media (max-width: 768px) {
  .tech-login-container {
    place-items: start center;
  }

  .login-card--editorial {
    grid-template-columns: 1fr;
    grid-template-areas:
      'brand'
      'form'
      'footer';
    grid-template-rows: auto auto auto;
    min-height: 0;
  }

  .card-header {
    display: grid;
    grid-template-columns: 48px minmax(0, 1fr);
    grid-template-rows: auto auto;
    column-gap: var(--space-md);
    min-height: 156px;
    padding: var(--space-xl);
  }

  .card-header::before {
    right: -80px;
    bottom: -24px;
    width: 200px;
    height: 120px;
  }

  .card-header::after {
    display: none;
  }

  .logo-container {
    grid-row: 1 / 3;
    width: 48px;
    height: 48px;
    margin: 0;
  }

  .system-title {
    align-self: end;
    font-size: var(--font-size-heading-2);
  }

  .system-subtitle {
    align-self: start;
    margin-top: var(--space-xxs);
  }

  .card-body {
    padding: var(--space-xxl) var(--space-xl) var(--space-lg);
  }
}

@media (max-width: 576px) {
  .tech-login-container {
    padding: var(--space-md);
  }

  .card-body {
    padding-right: var(--space-lg);
    padding-left: var(--space-lg);
  }

  .card-header {
    min-height: 144px;
    padding: var(--space-lg);
  }

  .form-options {
    gap: var(--space-xs);
  }

  .dialog-content {
    padding: var(--space-xs) 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .login-card,
  .spinner {
    animation: none;
  }
}
</style>
