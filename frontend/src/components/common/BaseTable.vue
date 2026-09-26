<template>
  <div class="base-table">
    <!-- 表格主体 -->
    <el-table
      :data="data"
      :loading="loading"
      :row-key="rowKey"
      @selection-change="handleSelectionChange"
      v-bind="$attrs"
    >
      <!-- 选择列 -->
      <el-table-column v-if="selectable" type="selection" width="55" />

      <!-- 插槽：允许外部传入列定义 -->
      <slot></slot>

      <!-- 默认列：操作列 -->
      <el-table-column v-if="showActions" label="操作" :width="actionWidth" fixed="right">
        <template #default="{ row }">
          <slot name="actions" :row="row">
            <!-- 默认操作按钮 -->
            <el-button link type="primary" size="default" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" size="default" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="default" @click="handleDelete(row)">删除</el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination" v-if="showPagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="currentPageSize"
        :total="total"
        :page-sizes="pageSizes"
        :layout="layout"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * BaseTable 组件 - 表格封装
 * @description 提供统一的表格样式和分页功能，支持自定义列、操作按钮
 */
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

/**
 * Props 定义
 */
interface Props {
  data: any[]              // 表格数据
  loading?: boolean        // 加载状态
  rowKey?: string         // 行唯一标识
  selectable?: boolean     // 是否支持多选
  showActions?: boolean    // 是否显示操作列
  actionWidth?: number     // 操作列宽度
  showPagination?: boolean // 是否显示分页
  total?: number          // 总数据量
  page?: number            // 当前页码
  pageSize?: number        // 每页条数
  pageSizes?: number[]     // 每页条数选项
  layout?: string          // 分页布局
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  rowKey: 'id',
  selectable: false,
  showActions: true,
  actionWidth: 200,
  showPagination: true,
  total: 0,
  page: 1,
  pageSize: 20,
  pageSizes: () => [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper'
})

const emit = defineEmits<{
  (e: 'selectionChange', value: any[]): void
  (e: 'pageChange', page: number): void
  (e: 'sizeChange', size: number): void
  (e: 'view', row: any): void
  (e: 'edit', row: any): void
  (e: 'delete', row: any): void
}>()

const currentPage = ref(props.page)
const currentPageSize = ref(props.pageSize)

watch(() => props.page, (val) => { currentPage.value = val })
watch(() => props.pageSize, (val) => { currentPageSize.value = val })

const handleSelectionChange = (selection: any[]) => {
  emit('selectionChange', selection)
}

const handlePageChange = (page: number) => {
  emit('pageChange', page)
}

const handleSizeChange = (size: number) => {
  emit('sizeChange', size)
}

const handleView = (row: any) => { emit('view', row) }
const handleEdit = (row: any) => { emit('edit', row) }
const handleDelete = (row: any) => { emit('delete', row) }
</script>

<style lang="scss" scoped>
.base-table {
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
</style>