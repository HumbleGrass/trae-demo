<template>
  <div class="empty-state">
    <div class="empty-state__content">
      <div class="empty-state__icon">
        <template v-if="customImage">
          <slot name="image"></slot>
        </template>
        <svg v-else viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:var(--tech-neon-cyan);stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:var(--tech-neon-magenta);stop-opacity:0.3" />
            </linearGradient>
            <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:var(--tech-neon-cyan)" />
              <stop offset="50%" style="stop-color:var(--tech-neon-magenta)" />
              <stop offset="100%" style="stop-color:var(--tech-neon-cyan)" />
            </linearGradient>
          </defs>

          <!-- Grid background -->
          <rect x="20" y="20" width="200" height="160" fill="url(#gridGrad)" rx="4"/>
          <g stroke="rgba(0, 245, 255, 0.2)" stroke-width="1">
            <line x1="20" y1="60" x2="220" y2="60"/>
            <line x1="20" y1="100" x2="220" y2="100"/>
            <line x1="20" y1="140" x2="220" y2="140"/>
            <line x1="60" y1="20" x2="60" y2="180"/>
            <line x1="120" y1="20" x2="120" y2="180"/>
            <line x1="180" y1="20" x2="180" y2="180"/>
          </g>

          <!-- Glitchy empty signal -->
          <g transform="translate(85, 60)">
            <rect x="0" y="0" width="70" height="80" fill="none" stroke="url(#borderGrad)" stroke-width="2" rx="2"/>
            <text x="35" y="45" text-anchor="middle" font-family="var(--tech-font-mono)" font-size="24" fill="var(--tech-neon-cyan)">NO</text>
            <text x="35" y="70" text-anchor="middle" font-family="var(--tech-font-mono)" font-size="12" fill="var(--tech-text-muted)">DATA</text>
            <rect x="5" y="5" width="60" height="10" fill="var(--tech-neon-cyan)" opacity="0.3" class="scan-line"/>
          </g>

          <!-- Corner decorations -->
          <path d="M20 40 L20 20 L40 20" stroke="var(--tech-neon-cyan)" stroke-width="2" fill="none"/>
          <path d="M200 20 L220 20 L220 40" stroke="var(--tech-neon-magenta)" stroke-width="2" fill="none"/>
          <path d="M20 140 L20 160 L40 160" stroke="var(--tech-neon-magenta)" stroke-width="2" fill="none"/>
          <path d="M200 160 L220 160 L220 140" stroke="var(--tech-neon-cyan)" stroke-width="2" fill="none"/>
        </svg>
      </div>

      <div class="empty-state__text">
        <p class="empty-state__description">
          <span class="description-prefix">// </span>
          {{ description }}
        </p>
      </div>

      <div class="empty-state__action" v-if="$slots.default">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * EmptyState 组件 - 空状态展示 (科技风格)
 * @description 用于列表、数据为空时展示友好提示
 */
interface Props {
  image?: string
  description?: string
  customImage?: boolean
}

withDefaults(defineProps<Props>(), {
  description: '暂无数据'
})
</script>

<style lang="scss" scoped>
.empty-state {
  padding: var(--space-xxl) var(--space-lg);
  display: flex;
  justify-content: center;
  align-items: center;

  &__content {
    text-align: center;
    max-width: 400px;
  }

  &__icon {
    margin-bottom: var(--space-lg);
    opacity: 0.72;

    .scan-line {
      animation: none;
    }
  }

  &__text {
    margin-bottom: 20px;
  }

  &__description {
    font-family: var(--font-family-base);
    font-size: var(--font-size-body-sm);
    color: var(--text-muted);
    margin: 0;
    letter-spacing: 0;

    .description-prefix {
      display: none;
    }
  }
}

</style>
