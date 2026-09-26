<template>
  <div class="tech-page">
    <div class="grid-bg"></div>
    <div class="scanlines"></div>

    <div class="page-header fade-in-down">
      <div class="header-left">
        <h1 class="page-title glitch" :data-text="title">
          <span class="gradient-text">{{ title }}</span>
        </h1>
        <p class="page-subtitle" v-if="subtitle">// {{ subtitle }}</p>
      </div>
      <div class="header-right" v-if="$slots.headerRight">
        <slot name="headerRight"></slot>
      </div>
    </div>

    <div class="page-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  subtitle: ''
})
</script>

<style lang="scss" scoped>
.tech-page {
  position: relative;
  min-height: 100vh;
  padding: 24px 32px;
}

.grid-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 0;
}

.scanlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1) 0px,
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 1;
  animation: scanline 8s linear infinite;
}

.page-header {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-default);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 200px;
    height: 2px;
    background: linear-gradient(90deg, var(--color-primary), #391c57, transparent);
  }
}

.header-left {
  .page-title {
    font-family: var(--font-family-base);
    font-size: 42px;
    font-weight: 900;
    margin: 0 0 8px 0;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    position: relative;

    .gradient-text {
      background: linear-gradient(135deg, var(--color-primary), #391c57);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .page-subtitle {
    font-family: var(--font-family-base);
    font-size: 14px;
    color: var(--text-secondary);
    margin: 0;
    font-weight: 400;
    letter-spacing: 0.1em;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.page-content {
  position: relative;
  z-index: 2;
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
</style>

<style lang="scss" scoped>
.tech-page {
  min-height: calc(100vh - var(--header-height));
  padding: var(--space-lg) var(--space-xl) var(--space-xxl);
}

.grid-bg,
.scanlines {
  display: none;
}

.page-header {
  align-items: flex-end;
  margin-bottom: var(--space-lg);
  padding-bottom: 0;
  border-bottom: 0;

  &::after {
    display: none;
  }
}

.header-left {
  .page-title {
    margin: 0 0 var(--space-xxs);
    color: var(--text-primary);
    font-family: var(--font-family-base);
    font-size: var(--font-size-heading-2);
    font-weight: var(--font-weight-heading);
    letter-spacing: 0;
    text-transform: none;

    .gradient-text {
      color: inherit;
      background: none;
      text-shadow: none;
      -webkit-text-fill-color: currentColor;
    }
  }

  .page-subtitle {
    margin: 0;
    color: var(--text-muted);
    font-family: var(--font-family-base);
    font-size: var(--font-size-caption);
    letter-spacing: 0;
  }
}

.header-right {
  gap: var(--space-xs);
}

@media (max-width: 768px) {
  .tech-page {
    padding: var(--space-md);
  }

  .page-header {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
