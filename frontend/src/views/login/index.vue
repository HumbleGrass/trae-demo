<template>
  <div class="tech-login-container">
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
                    <stop stop-color="#62aef0"/>
                    <stop offset="1" stop-color="#0075de"/>
                  </linearGradient>
                  <linearGradient id="tech-secondary-gradient" x1="42" y1="12" x2="56" y2="52" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#391c57"/>
                    <stop offset="1" stop-color="#0075de"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <h1 class="system-title">知阅阁</h1>
          <p class="system-subtitle">LIBRARY MANAGEMENT SYSTEM</p>
        </div>

        <!-- 登录表单区域 -->
        <div class="card-body">
          <div class="welcome-text">
            <span class="typing-text">{{ typingText }}</span>
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
