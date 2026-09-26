<template>
  <div class="login-page">
    <!-- 背景四层：渐变兜底 → 图书馆照片 → 暗色遮罩 → 模糊光斑 -->
    <div class="bg-layer bg-base" aria-hidden="true"></div>
    <div class="bg-layer bg-photo" aria-hidden="true"></div>
    <div class="bg-layer bg-scrim" aria-hidden="true"></div>
    <div class="bg-layer bg-bloom" aria-hidden="true"></div>

    <main class="login-stage">
      <!-- 居中毛玻璃登录卡片 -->
      <section class="auth-card" aria-labelledby="brand-name">
        <header class="brand">
          <div class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 8.1a3.4 3.4 0 0 0-3.4-3.4H3.4v12.6h5.2a3.4 3.4 0 0 1 3.4 3.4" />
              <path d="M12 8.1a3.4 3.4 0 0 1 3.4-3.4h5.2v12.6h-5.2a3.4 3.4 0 0 0-3.4 3.4" />
            </svg>
          </div>
          <div class="brand-text">
            <h1 id="brand-name" class="brand-name">知阅阁</h1>
            <p class="brand-sub">
              <span class="brand-sub-text">LIBRARY MANAGEMENT SYSTEM</span>
              <span class="brand-sub-rule" aria-hidden="true"></span>
            </p>
          </div>
        </header>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="auth-form login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username" :error="loginErrors.username">
            <div class="field-stack">
              <label class="field-label" for="login-username">{{ t('login.username') }}</label>
              <el-input
                id="login-username"
                v-model="form.username"
                class="glass-input"
                :placeholder="t('login.usernamePlaceholder')"
                autocomplete="username"
                spellcheck="false"
                @input="loginErrors.username = ''"
              >
                <template #prefix>
                  <svg class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 20.6v-1.9a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v1.9" />
                    <circle cx="12" cy="7.4" r="3.9" />
                  </svg>
                </template>
              </el-input>
            </div>
          </el-form-item>

          <el-form-item prop="password" :error="loginErrors.password">
            <div class="field-stack">
              <label class="field-label" for="login-password">{{ t('login.password') }}</label>
              <el-input
                id="login-password"
                ref="passwordInputRef"
                v-model="form.password"
                :type="passwordVisible ? 'text' : 'password'"
                class="glass-input"
                :placeholder="t('login.passwordPlaceholder')"
                autocomplete="current-password"
                @input="loginErrors.password = ''"
                @keyup.enter="handleLogin"
              >
                <template #prefix>
                  <svg class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="4.4" y="10.4" width="15.2" height="9.6" rx="2.6" />
                    <path d="M8 10.4V7.9a4 4 0 0 1 8 0v2.5" />
                  </svg>
                </template>
                <template #suffix>
                  <!-- 与设计稿一致：常驻的密码显隐切换（element-plus 2.13 起空值时隐藏自带图标） -->
                  <button
                    type="button"
                    class="reveal-toggle"
                    :aria-pressed="passwordVisible"
                    :aria-label="passwordVisible ? t('login.hidePassword') : t('login.showPassword')"
                    @click="togglePasswordVisible"
                  >
                    <svg v-show="!passwordVisible" class="reveal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.6 12S6.1 5.9 12 5.9 21.4 12 21.4 12 17.9 18.1 12 18.1 2.6 12 2.6 12Z" />
                      <circle cx="12" cy="12" r="3.1" />
                    </svg>
                    <svg v-show="passwordVisible" class="reveal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4.4 20 20.4" />
                      <path d="M10 6.2A10.3 10.3 0 0 1 12 5.9c5.9 0 9.4 6.1 9.4 6.1a17.6 17.6 0 0 1-3.5 3.9" />
                      <path d="M6.7 7.8A17.4 17.4 0 0 0 2.6 12S6.1 18.1 12 18.1c1.2 0 2.3-.2 3.2-.6" />
                      <path d="M9.7 10.2a3.1 3.1 0 0 0 4.2 4.3" />
                    </svg>
                  </button>
                </template>
              </el-input>
            </div>
          </el-form-item>

          <div class="form-row">
            <el-checkbox v-model="rememberMe">{{ t('login.rememberPassword') }}</el-checkbox>
            <button type="button" class="link-btn forgot-link" @click="showForgotDialog = true">
              {{ t('login.forgotPassword') }}
            </button>
          </div>

          <button
            type="submit"
            class="login-button"
            :class="{ 'is-loading': loading }"
            :disabled="loading"
            aria-label="登录"
            @click="handleLogin"
          >
            <span class="spinner" aria-hidden="true"></span>
            <span class="btn-label">{{ t('login.submit') }}</span>
          </button>
        </el-form>

        <p class="signup-row">
          <span>{{ t('login.noAccount') }}</span>
          <button type="button" class="link-btn register-link" @click="showRegisterDialog = true">
            {{ t('login.registerNow') }}
          </button>
        </p>
      </section>
    </main>
  </div>

  <!-- 注册弹窗（Element Plus 弹窗承载校验，玻璃样式见 :global；与设计稿一致，点击遮罩可关闭） -->
  <el-dialog
    v-model="showRegisterDialog"
    :title="''"
    width="400px"
    modal-class="glass-overlay"
    class="glass-dialog"
  >
    <div class="dialog-content">
      <div class="dialog-header">
        <h3>{{ t('login.registerTitle') }}</h3>
        <p>{{ t('login.registerHint') }}</p>
      </div>

      <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" class="auth-form register-form">
        <el-form-item prop="username">
          <div class="field-stack">
            <label class="field-label" for="register-username">{{ t('login.username') }}</label>
            <el-input
              id="register-username"
              v-model="registerForm.username"
              class="glass-input"
              :placeholder="t('login.registerUsernamePlaceholder')"
              autocomplete="username"
              spellcheck="false"
            >
              <template #prefix>
                <svg class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 20.6v-1.9a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v1.9" />
                  <circle cx="12" cy="7.4" r="3.9" />
                </svg>
              </template>
            </el-input>
          </div>
        </el-form-item>

        <el-form-item prop="password">
          <div class="field-stack">
            <label class="field-label" for="register-password">{{ t('login.password') }}</label>
            <el-input
              id="register-password"
              v-model="registerForm.password"
              type="password"
              class="glass-input"
              :placeholder="t('login.registerPasswordPlaceholder')"
              autocomplete="new-password"
            >
              <template #prefix>
                <svg class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="4.4" y="10.4" width="15.2" height="9.6" rx="2.6" />
                  <path d="M8 10.4V7.9a4 4 0 0 1 8 0v2.5" />
                </svg>
              </template>
            </el-input>
          </div>
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <div class="field-stack">
            <label class="field-label" for="register-confirm">{{ t('login.confirmPassword') }}</label>
            <el-input
              id="register-confirm"
              v-model="registerForm.confirmPassword"
              type="password"
              class="glass-input"
              :placeholder="t('login.confirmPlaceholder')"
              autocomplete="new-password"
              @keyup.enter="handleRegister"
            >
              <template #prefix>
                <svg class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="4.4" y="10.4" width="15.2" height="9.6" rx="2.6" />
                  <path d="M8 10.4V7.9a4 4 0 0 1 8 0v2.5" />
                </svg>
              </template>
            </el-input>
          </div>
        </el-form-item>
      </el-form>

      <div class="dialog-footer">
        <button type="button" class="btn-ghost" @click="showRegisterDialog = false">
          {{ t('common.cancel') }}
        </button>
        <button type="button" class="btn-solid" :disabled="registerLoading" @click="handleRegister">
          {{ registerLoading ? t('login.registerLoading') : t('login.register') }}
        </button>
      </div>
    </div>
  </el-dialog>

  <!-- 忘记密码弹窗 -->
  <el-dialog
    v-model="showForgotDialog"
    :title="''"
    width="400px"
    modal-class="glass-overlay"
    class="glass-dialog"
  >
    <div class="dialog-content">
      <div class="dialog-header">
        <h3>{{ t('login.forgotTitle') }}</h3>
        <p>{{ t('login.forgotHint') }}</p>
      </div>
      <div class="forgot-content">
        <div class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6.2 3.9h3.1l1.5 4-2 1.4a12.6 12.6 0 0 0 5.9 5.9l1.4-2 4 1.5v3.1a1.9 1.9 0 0 1-2.1 1.9A16.6 16.6 0 0 1 4.3 6a1.9 1.9 0 0 1 1.9-2.1Z" />
          </svg>
          <span class="contact-text">
            <span class="contact-label">{{ t('login.adminPhone') }}</span>
            <a class="contact-value" href="tel:13800000000">138-XXXX-XXXX</a>
          </span>
        </div>
        <div class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3.4" y="5.6" width="17.2" height="12.8" rx="2.6" />
            <path d="m4.2 7.4 7.8 5.4 7.8-5.4" />
          </svg>
          <span class="contact-text">
            <span class="contact-label">{{ t('login.adminEmail') }}</span>
            <a class="contact-value" href="mailto:admin@library.com">admin@library.com</a>
          </span>
        </div>
      </div>
      <div class="dialog-footer">
        <button type="button" class="btn-solid full-width" @click="showForgotDialog = false">
          {{ t('login.gotIt') }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, FormInstance, FormRules, InputInstance } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { register } from '@/api/auth/index'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

/** 「记住密码」只持久化用户名到 localStorage，绝不落密码 */
const REMEMBER_KEY = 'zhiyuege.remember'

const formRef = ref<FormInstance>()
const loading = ref(false)
const showRegisterDialog = ref(false)
const showForgotDialog = ref(false)
const registerFormRef = ref<FormInstance>()
const registerLoading = ref(false)
const rememberMe = ref(false)

/** 密码显隐状态与输入框实例（切换后按设计稿回焦输入框） */
const passwordVisible = ref(false)
const passwordInputRef = ref<InputInstance>()

const togglePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value
  passwordInputRef.value?.focus()
}

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
      if (rememberMe.value) {
        localStorage.setItem(REMEMBER_KEY, form.username.trim())
      } else {
        localStorage.removeItem(REMEMBER_KEY)
      }
      ElMessage.success({ message: t('login.success'), customClass: 'glass-toast' })
      router.push('/')
    } catch (error: any) {
      ElMessage.error({ message: error.message || t('login.failed'), customClass: 'glass-toast' })
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
      ElMessage.success({ message: t('login.registerSuccess'), customClass: 'glass-toast' })
      showRegisterDialog.value = false
      registerFormRef.value?.resetFields()
      form.username = registerForm.username
    } catch (error: any) {
      ElMessage.error({ message: error.message || t('login.registerFailed'), customClass: 'glass-toast' })
    } finally {
      registerLoading.value = false
    }
  })
}

onMounted(() => {
  const savedUsername = localStorage.getItem(REMEMBER_KEY)
  if (savedUsername) {
    form.username = savedUsername
    rememberMe.value = true
  }
})
</script>

<style lang="scss" scoped>
/* ═══════════════════════════════════════════════════════════════
   页面局部设计令牌 —— OpenDesign「Arc」毛玻璃设计系统
   仅登录页作用域使用，不影响全局 Notion 设计系统。
   弹窗会被 Teleport 到 body 之外，令牌需同时挂在登录根节点与
   弹窗遮罩（.glass-overlay / .glass-dialog）上。
   ═══════════════════════════════════════════════════════════════ */
:global(.login-page),
:global(.glass-overlay),
:global(.glass-dialog.el-dialog) {
  /* Arc 色板 */
  --arc-accent: #ff5f5f;
  --arc-accent-on: #ffffff;
  --arc-ink: #1a1a1f;
  --arc-ink-2: #54545a;
  --arc-danger: #f56565;
  --arc-warn: #f6ad55;
  --arc-violet: #b794f4;

  /* 毛玻璃派生色（保证毛玻璃表面上的对比度达标） */
  --on-glass-ink: color-mix(in oklab, var(--arc-ink), var(--arc-ink-2) 45%);
  --on-glass-accent: color-mix(in oklab, var(--arc-accent), black 38%);
  --on-glass-danger: color-mix(in oklab, var(--arc-danger), black 38%);
  --hairline: rgba(20, 20, 25, 0.09);

  /* Arc 形状 / 动效 */
  --arc-radius-sm: 8px;
  --arc-radius-md: 12px;
  --arc-radius-lg: 16px;
  --arc-motion-fast: 200ms;
  --arc-motion-base: 320ms;
  --arc-ease: cubic-bezier(0.32, 0.72, 0, 1);
  --arc-focus-ring: 0 0 0 4px color-mix(in oklab, var(--arc-accent), transparent 80%);

  /* Arc 间距刻度（4px 基数）。全局 design-tokens 只提供 --space-xxs..xxl，
     登录页沿用设计稿的数字刻度，在此局部补齐，避免 var(--space-N) 静默失效 */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
}

.login-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: var(--space-8) 16px;
  overflow-x: hidden;
  background-color: var(--arc-ink);
  font-family: var(--font-family-base);
}

/* ── 背景四层（均装饰性；照片加载失败时页面依然成立） ───────────── */
.bg-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* 1 · 暖色渐变兜底 */
.bg-base {
  background:
    radial-gradient(58rem 40rem at 14% 16%, color-mix(in oklab, var(--arc-accent), transparent 68%), transparent 68%),
    radial-gradient(46rem 34rem at 86% 84%, color-mix(in oklab, var(--arc-warn), transparent 74%), transparent 70%),
    linear-gradient(165deg, color-mix(in oklab, var(--arc-ink), var(--arc-accent) 10%), var(--arc-ink));
}

/* 2 · 图书馆照片（public/images/login-bg.jpg） */
.bg-photo {
  background-image: url('/images/login-bg.jpg');
  background-size: cover;
  background-position: center 42%;
  background-repeat: no-repeat;
  filter: saturate(1.06) contrast(1.02) brightness(0.92);
}

/* 3 · 暗色遮罩，保证卡片与文字可读 */
.bg-scrim {
  background:
    linear-gradient(178deg, rgba(20, 20, 25, 0.52) 0%, rgba(20, 20, 25, 0.62) 46%, rgba(20, 20, 25, 0.74) 100%),
    radial-gradient(90rem 60rem at 50% 50%, rgba(20, 20, 25, 0.08), rgba(20, 20, 25, 0.34) 100%);
}

/* 4 · 模糊光斑 —— 透过毛玻璃的暖色光，停靠在视口边缘 */
.bg-bloom {
  background:
    radial-gradient(21rem 21rem at 8% 28%, color-mix(in oklab, var(--arc-accent), transparent 70%), transparent 72%),
    radial-gradient(19rem 19rem at 93% 72%, color-mix(in oklab, var(--arc-warn), transparent 74%), transparent 74%),
    radial-gradient(17rem 17rem at 80% 10%, color-mix(in oklab, var(--arc-violet), transparent 78%), transparent 74%);
  filter: blur(34px);
}

/* ═══════════════════════════════════════════════════════════════
   居中毛玻璃卡片
   ═══════════════════════════════════════════════════════════════ */
.login-stage {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
}

.auth-card {
  width: min(100%, 420px);
  padding: 40px 36px 30px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: var(--arc-radius-lg);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.04)),
    rgba(255, 255, 255, 0.75);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  backdrop-filter: blur(24px) saturate(180%);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 24px 64px rgba(20, 20, 25, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  animation: login-card-in var(--arc-motion-base) var(--arc-ease) both;
}

@keyframes login-card-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── 品牌区：左对齐横向 lockup —— 印章在左，文字块悬挂其右，
      品牌名、字段标签与输入框共享同一条左轴线 ─────────────────────── */
.brand {
  display: flex;
  align-items: center;
  /* --space-5 而非 --space-4：印章光环占掉 6px，可见间距仍落在 4px 栅格 */
  gap: var(--space-5);
}

.brand-mark {
  flex: none;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  color: var(--arc-accent-on);
  border-radius: var(--arc-radius-lg);
  /* Sunset 渐变经 oklab 加深，白字对比度 ≥ 5:1；外圈细环呼应藏书票印章 */
  background: linear-gradient(135deg,
      color-mix(in oklab, var(--arc-accent), black 22%),
      color-mix(in oklab, var(--arc-accent), black 34%));
  box-shadow:
    0 0 0 6px color-mix(in oklab, var(--arc-accent), transparent 86%),
    0 10px 26px color-mix(in oklab, var(--arc-accent), transparent 66%),
    inset 0 1px 0 rgba(255, 255, 255, 0.32),
    inset 0 0 0 1px rgba(255, 255, 255, 0.16);
}

.brand-mark svg {
  display: block;
  width: 28px;
  height: 28px;
}

.brand-text {
  flex: 1 1 auto;
  min-width: 0;
}

.brand-name {
  margin: 0;
  color: var(--arc-ink);
  /* 品牌字用衬线体 —— 唯一的编辑感时刻 */
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Source Han Serif CN', 'STZhongsong', 'SimSun', serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.2;
  /* 左对齐后收紧字距即可，三个字读作一个整体字标 */
  letter-spacing: 0.06em;
}

/* 眉题带引导线：延伸到卡片右缘，与下方输入框共享右边界 */
.brand-sub {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: var(--space-3) 0 0;
  color: var(--on-glass-ink);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.brand-sub-text {
  flex: 0 1 auto;
  min-width: 0;
  letter-spacing: 0.16em;
  /* 抵消末字符自带的字距，让引导线与文字保持整档 --space-3 间距 */
  margin-right: -0.16em;
}

.brand-sub-rule {
  flex: 1 1 0;
  min-width: 0;
  height: 1px;
  border-radius: 1px;
  background: color-mix(in oklab, var(--arc-ink-2), transparent 70%);
}

/* ── 表单 ───────────────────────────────────────────────────────── */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  /* 品牌区是卡片唯一的头部元素，其下留整档 32px 分隔 */
  margin-top: var(--space-8);
}

.auth-form :deep(.el-form-item) {
  width: 100%;
  margin-bottom: 0;
}

.auth-form :deep(.el-form-item__content) {
  display: block;
  line-height: normal;
}

.field-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
}

.field-label {
  color: var(--on-glass-ink);
  font-family: var(--font-family-base);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
}

/* 毛玻璃内凹输入控件（Element Plus 输入框定制） */
.auth-form :deep(.el-input__wrapper) {
  min-height: 46px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.55);
  border-radius: var(--arc-radius-md);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.66) inset,
    inset 0 1px 2px rgba(20, 20, 25, 0.11),
    inset 0 4px 10px rgba(20, 20, 25, 0.07);
  transition:
    box-shadow var(--arc-motion-fast) var(--arc-ease),
    background-color var(--arc-motion-fast) var(--arc-ease);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
  backdrop-filter: blur(10px) saturate(140%);
}

.auth-form :deep(.el-input__wrapper:hover) {
  background: rgba(255, 255, 255, 0.62);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.88) inset,
    inset 0 1px 2px rgba(20, 20, 25, 0.1);
}

.auth-form :deep(.el-input__wrapper.is-focus) {
  background: rgba(255, 255, 255, 0.68);
  box-shadow:
    0 0 0 1px color-mix(in oklab, var(--arc-accent), black 22%) inset,
    var(--arc-focus-ring),
    inset 0 1px 2px rgba(20, 20, 25, 0.07);
}

/* 聚焦时前缀图标由灰转珊瑚深色（设计稿 .control:focus-within） */
.auth-form :deep(.el-input__wrapper.is-focus .control-icon) {
  color: var(--on-glass-accent);
}

.auth-form :deep(.el-input__inner) {
  height: 44px;
  color: var(--arc-ink);
  font-family: var(--font-family-base);
  font-size: 15px;
  font-weight: 500;
}

.auth-form :deep(.el-input__inner::placeholder) {
  color: var(--arc-ink-2);
  opacity: 1;
}

.auth-form :deep(.el-input__prefix) {
  margin-right: 2px;
  color: var(--arc-ink-2);
}

.auth-form :deep(.el-input__prefix .control-icon) {
  width: 18px;
  height: 18px;
}

.auth-form :deep(.el-input__suffix) {
  color: var(--arc-ink-2);
}

/* 密码显隐切换 —— 设计稿同款常驻按钮（44px 触达区，环内收焦点圈） */
.reveal-toggle {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  color: var(--arc-ink-2);
  background: none;
  border: 0;
  border-radius: var(--arc-radius-sm);
  cursor: pointer;
  transition: color var(--arc-motion-fast) var(--arc-ease);
}

.reveal-toggle:hover {
  color: var(--arc-ink);
}

.reveal-toggle:focus-visible {
  outline: 2px solid color-mix(in oklab, var(--arc-accent), black 38%);
  outline-offset: -4px;
}

.reveal-icon {
  display: block;
  width: 18px;
  height: 18px;
}

/* 校验失败态：红色描边 + 光晕；图标规则置于聚焦规则之后，同特异性时生效 */
.auth-form :deep(.el-form-item.is-error .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.62);
  box-shadow:
    0 0 0 1px color-mix(in oklab, var(--arc-danger), transparent 22%) inset,
    0 0 0 4px color-mix(in oklab, var(--arc-danger), transparent 84%),
    inset 0 1px 2px rgba(20, 20, 25, 0.07);
}

.auth-form :deep(.el-form-item.is-error .el-input__wrapper .control-icon) {
  color: var(--on-glass-danger);
}

.auth-form :deep(.el-form-item__error) {
  position: static;
  padding-top: 8px;
  color: var(--on-glass-danger);
  font-family: var(--font-family-base);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.35;
}

/* ── 记住密码 / 忘记密码 行 ─────────────────────────────────────── */
.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-top: var(--space-1);
}

.auth-form :deep(.el-checkbox) {
  min-height: 44px;
  margin-right: 0;
}

.auth-form :deep(.el-checkbox__label) {
  color: var(--on-glass-ink);
  font-size: 13px;
  font-weight: 500;
}

.auth-form :deep(.el-checkbox__inner) {
  width: 19px;
  height: 19px;
  background: rgba(255, 255, 255, 0.6);
  border: 1.5px solid var(--arc-ink-2);
  border-radius: 6px;
}

.auth-form :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: color-mix(in oklab, var(--arc-accent), black 26%);
  border-color: transparent;
}

.auth-form :deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
  border-color: var(--arc-accent-on);
}

/* 键盘焦点环：设计稿为复选框提供可见的深珊瑚色外圈 */
.auth-form :deep(.el-checkbox__original:focus-visible + .el-checkbox__inner) {
  outline: 2px solid color-mix(in oklab, var(--arc-accent), black 38%);
  outline-offset: 2px;
}

/* 悬停时未选中框边框加深（设计稿 .check:hover） */
.auth-form :deep(.el-checkbox:hover:not(.is-checked) .el-checkbox__inner) {
  border-color: var(--arc-ink);
}

/* 文字按钮（非第二实心 CTA） */
.link-btn {
  display: inline-flex;
  align-items: center;
  padding: 2px 0;
  color: var(--on-glass-accent);
  font-family: var(--font-family-base);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  background: none;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  transition: color var(--arc-motion-fast) var(--arc-ease);
}

.link-btn:hover {
  color: var(--on-glass-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ── 主 CTA —— 卡片内唯一实心操作 ───────────────────────────────── */
.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 48px;
  margin-top: var(--space-2);
  padding: 12px 20px;
  color: var(--arc-accent-on);
  font-family: var(--font-family-base);
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg,
      color-mix(in oklab, var(--arc-accent), black 22%),
      color-mix(in oklab, var(--arc-accent), black 34%));
  border: 0;
  border-radius: var(--arc-radius-md);
  box-shadow: 0 4px 16px color-mix(in oklab, var(--arc-accent), transparent 62%);
  cursor: pointer;
  transition:
    transform var(--arc-motion-fast) var(--arc-ease),
    box-shadow var(--arc-motion-fast) var(--arc-ease),
    background var(--arc-motion-fast) var(--arc-ease);
}

.login-button:hover:not(:disabled) {
  background: linear-gradient(135deg,
      color-mix(in oklab, var(--arc-accent), black 28%),
      color-mix(in oklab, var(--arc-accent), black 40%));
  box-shadow: 0 8px 24px color-mix(in oklab, var(--arc-accent), transparent 52%);
  transform: translateY(-1px);
}

.login-button:active:not(:disabled) {
  background: linear-gradient(135deg,
      color-mix(in oklab, var(--arc-accent), black 34%),
      color-mix(in oklab, var(--arc-accent), black 46%));
  box-shadow: 0 2px 10px color-mix(in oklab, var(--arc-accent), transparent 66%);
  transform: translateY(0);
}

.login-button:disabled {
  cursor: default;
  opacity: 0.86;
}

.btn-label {
  letter-spacing: 0.32em;
  text-indent: 0.32em;
}

/* 加载态与设计稿一致：保留「登录」标签，仅归零字距并亮出 spinner */
.login-button.is-loading .btn-label {
  letter-spacing: normal;
  text-indent: 0;
}

.spinner {
  display: none;
  flex: none;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.42);
  border-top-color: var(--arc-accent-on);
  border-radius: 50%;
  animation: login-spin 720ms linear infinite;
}

.login-button.is-loading .spinner {
  display: block;
}

@keyframes login-spin {
  to { transform: rotate(360deg); }
}

/* ── 注册入口 ────────────────────────────────────────────────────── */
.signup-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  margin: var(--space-6) 0 0;
  padding-top: var(--space-5);
  border-top: 1px solid var(--hairline);
  color: var(--on-glass-ink);
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}

/* ── 焦点可见性 ─────────────────────────────────────────────────── */
.login-page :deep(.link-btn:focus-visible),
.login-page :deep(.login-button:focus-visible),
.dialog-content :deep(.btn-ghost:focus-visible),
.dialog-content :deep(.btn-solid:focus-visible) {
  outline: 2px solid color-mix(in oklab, var(--arc-accent), black 38%);
  outline-offset: 2px;
}

/* ═══════════════════════════════════════════════════════════════
   弹窗（Teleport 到 body，需 :global 玻璃样式）
   ═══════════════════════════════════════════════════════════════ */
:global(.glass-overlay) {
  background: rgba(20, 20, 25, 0.5);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}

/* 玻璃胶囊 Toast —— ElMessage 传 customClass: 'glass-toast' 时生效，
   与设计稿 .toast（白玻璃胶囊、顶部居中）对齐 */
:global(.el-message.glass-toast) {
  padding: 12px 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.86);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  backdrop-filter: blur(24px) saturate(180%);
  box-shadow: 0 8px 32px rgba(20, 20, 25, 0.24);
}

:global(.el-message.glass-toast .el-message__content) {
  color: var(--arc-ink, #1a1a1f);
  font-size: 13px;
  font-weight: 600;
}

:global(.glass-dialog.el-dialog) {
  width: min(400px, calc(100vw - 32px));
  padding: 30px 30px 26px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: var(--arc-radius-lg);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.05)),
    rgba(255, 255, 255, 0.78);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  backdrop-filter: blur(30px) saturate(180%);
  box-shadow:
    0 24px 64px rgba(20, 20, 25, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

:global(.glass-dialog .el-dialog__header) {
  padding: 0;
  margin: 0;
}

:global(.glass-dialog .el-dialog__headerbtn) {
  top: 22px;
  right: 22px;
  width: 44px;
  height: 44px;
  color: var(--arc-ink-2, #54545a);
  border-radius: var(--arc-radius-sm, 8px);
  transition:
    color var(--arc-motion-fast, 200ms) var(--arc-ease, cubic-bezier(0.32, 0.72, 0, 1)),
    background-color var(--arc-motion-fast, 200ms) var(--arc-ease, cubic-bezier(0.32, 0.72, 0, 1));
}

:global(.glass-dialog .el-dialog__headerbtn:hover) {
  color: var(--arc-ink, #1a1a1f);
  background: rgba(20, 20, 25, 0.06);
}

/* EP 内层图标有自己的颜色规则，强制继承 headerbtn 的暖灰色 */
:global(.glass-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: inherit;
}

:global(.glass-dialog .el-dialog__headerbtn:hover .el-dialog__close) {
  color: inherit;
}

:global(.glass-dialog .el-dialog__body) {
  padding: 0;
  color: var(--arc-ink, #1a1a1f);
}

.dialog-content {
  color: var(--arc-ink);
}

.dialog-header {
  margin-bottom: var(--space-5);
  padding-right: var(--space-6);
}

.dialog-header h3 {
  margin: 0;
  color: var(--arc-ink);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.dialog-header p {
  margin: 6px 0 0;
  color: var(--on-glass-ink);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
}

.register-form {
  margin-top: 0;
}

.dialog-footer {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

.dialog-footer > * {
  flex: 1 1 0;
}

.btn-ghost,
.btn-solid {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 11px 20px;
  font-family: var(--font-family-base);
  font-size: 15px;
  font-weight: 600;
  border-radius: var(--arc-radius-md);
  cursor: pointer;
  transition:
    background-color var(--arc-motion-fast) var(--arc-ease),
    box-shadow var(--arc-motion-fast) var(--arc-ease),
    background var(--arc-motion-fast) var(--arc-ease);
}

.btn-ghost {
  color: var(--arc-ink);
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 4px 14px rgba(20, 20, 25, 0.1);
}

.btn-solid {
  color: var(--arc-accent-on);
  background: linear-gradient(135deg,
      color-mix(in oklab, var(--arc-accent), black 22%),
      color-mix(in oklab, var(--arc-accent), black 34%));
  border: 0;
  box-shadow: 0 4px 16px color-mix(in oklab, var(--arc-accent), transparent 62%);
}

.btn-solid:hover:not(:disabled) {
  background: linear-gradient(135deg,
      color-mix(in oklab, var(--arc-accent), black 28%),
      color-mix(in oklab, var(--arc-accent), black 40%));
  box-shadow: 0 8px 24px color-mix(in oklab, var(--arc-accent), transparent 52%);
}

.btn-solid:disabled {
  cursor: not-allowed;
  opacity: 0.86;
}

.btn-solid.full-width {
  flex: none;
  width: 100%;
}

/* ── 忘记密码联系方式 ───────────────────────────────────────────── */
.forgot-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 13px 15px;
  background: rgba(255, 255, 255, 0.52);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: var(--arc-radius-md);
}

.contact-icon {
  flex: none;
  width: 17px;
  height: 17px;
  color: var(--on-glass-accent);
}

.contact-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.contact-label {
  color: var(--on-glass-ink);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.contact-value {
  color: var(--arc-ink);
  /* 设计稿联系方式用等宽字体（Berkeley Mono → 系统等宽兜底） */
  font-family: 'Berkeley Mono', ui-monospace, Menlo, Consolas, monospace;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  overflow-wrap: anywhere;
}

a.contact-value:hover {
  color: var(--on-glass-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ═══════════════════════════════════════════════════════════════
   响应式：桌面 / 平板 / 手机
   ═══════════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .login-page {
    padding: var(--space-8) 24px;
  }
}

@media (max-width: 600px) {
  .login-page {
    padding: var(--space-6) 16px;
  }

  .auth-card {
    padding: 32px 24px 24px;
  }

  .brand {
    gap: var(--space-4);
  }

  .brand-mark {
    width: 46px;
    height: 46px;
  }

  .brand-mark svg {
    width: 23px;
    height: 23px;
  }

  .brand-name {
    font-size: 26px;
  }

  /* 窄屏下文字列只给引导线留下约 10px 残段，观感像渲染瑕疵——眉题单独成行 */
  .brand-sub-rule {
    display: none;
  }

  /* 与设计稿一致：窄屏下弹窗按钮纵向排列，主操作在上 */
  .dialog-footer {
    flex-direction: column-reverse;
  }

  :global(.glass-dialog.el-dialog) {
    padding: 26px 22px 22px;
  }
}

@media (max-width: 380px) {
  .form-row {
    flex-wrap: wrap;
    row-gap: 0;
  }
}

/* ── 减弱动态效果：与设计稿一致，整页关闭动画/过渡，状态依然完整可读 ── */
@media (prefers-reduced-motion: reduce) {
  .login-page,
  .login-page :deep(*),
  .login-page :deep(*::before),
  .login-page :deep(*::after),
  :global(.glass-overlay),
  :global(.glass-overlay *),
  :global(.glass-dialog.el-dialog),
  :global(.glass-dialog.el-dialog *) {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }

  .login-button:hover:not(:disabled) {
    transform: none;
  }

  /* 旋转被关掉后补齐静态环颜色，spinner 仍可辨认 */
  .spinner {
    animation: none;
    border-top-color: rgba(255, 255, 255, 0.42);
    border-left-color: var(--arc-accent-on);
  }
}
</style>
