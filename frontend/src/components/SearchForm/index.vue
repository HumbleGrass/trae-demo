<template>
  <TechCard class="search-form-card">
    <el-form :model="searchForm" :inline="true" @submit.prevent="handleSearch" class="search-form">
      <el-form-item v-for="item in searchFields" :key="item.prop" :label="item.label" class="form-item">
        <div v-if="item.type === 'input'" class="tech-input-wrapper">
          <el-input
            v-model="searchForm[item.prop]"
            :placeholder="item.placeholder"
            size="default"
            class="tech-input"
            @change="handleSearch"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <span class="input-border"></span>
        </div>

        <div v-else-if="item.type === 'select'" class="tech-select-wrapper">
          <el-select
            v-model="searchForm[item.prop]"
            :placeholder="item.placeholder"
            size="default"
            class="tech-select"
            @change="handleSearch"
            clearable
          >
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <span class="select-border"></span>
        </div>

        <div v-else-if="item.type === 'date'" class="tech-input-wrapper">
          <el-date-picker
            v-model="searchForm[item.prop]"
            type="date"
            size="default"
            :placeholder="item.placeholder"
            class="tech-date-picker tech-input"
            @change="handleSearch"
          />
          <span class="input-border"></span>
        </div>
      </el-form-item>

      <el-form-item class="action-buttons">
        <TechButton :icon="Search" @click="handleSearch">搜索</TechButton>
        <TechButton variant="secondary" :icon="RefreshLeft" @click="handleReset">重置</TechButton>
      </el-form-item>
    </el-form>
  </TechCard>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue'
import { Search, RefreshLeft } from '@element-plus/icons-vue'
import TechCard from '@/components/common/TechCard.vue'
import TechButton from '@/components/common/TechButton.vue'

interface SearchField {
  prop: string
  label: string
  type: 'input' | 'select' | 'date'
  placeholder?: string
  options?: { label: string; value: any }[]
}

interface Props {
  fields: SearchField[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'search', value: Record<string, any>): void
  (e: 'reset'): void
}>()

const searchForm = reactive<Record<string, any>>({})

function initForm() {
  props.fields.forEach(field => {
    if (!(field.prop in searchForm)) {
      searchForm[field.prop] = undefined
    }
  })
}

onMounted(() => {
  initForm()
})

watch(() => props.fields, () => {
  initForm()
}, { deep: true })

function handleSearch() {
  emit('search', { ...searchForm })
}

function handleReset() {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = undefined
  })
  emit('reset')
}
</script>

<style scoped lang="scss">
.search-form-card {
  margin-bottom: var(--space-md);
}

.search-form {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: 0;
}

.form-item {
  margin: 0;

  :deep(.el-form-item__label) {
    padding-right: var(--space-xs);
    color: var(--text-muted);
    font-family: var(--font-family-base);
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-body);
    letter-spacing: 0;
  }
}

.tech-input-wrapper,
.tech-select-wrapper {
  min-width: 180px;
}

.tech-input,
.tech-select,
.tech-date-picker {
  width: 100%;
}

.input-border,
.select-border {
  display: none;
}

.action-buttons {
  display: flex;
  gap: var(--space-xs);
  margin-left: auto;
}

@media (max-width: 768px) {
  .search-form,
  .form-item,
  .tech-input-wrapper,
  .tech-select-wrapper,
  .action-buttons {
    width: 100%;
  }

  .action-buttons > * {
    flex: 1;
  }
}
</style>
