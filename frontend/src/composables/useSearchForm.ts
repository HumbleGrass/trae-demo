/**
 * 搜索表单相关的 composable
 * @description 提供通用的搜索表单状态管理
 */
import { reactive, toRefs } from 'vue'

/**
 * 创建搜索表单状态
 * @param initialValues - 初始值
 * @returns 搜索表单状态和方法
 */
export function useSearchForm<T extends Record<string, any>>(initialValues: T) {
  const form = reactive<T>({ ...initialValues })

  /**
   * 设置表单值
   */
  function setValues(values: Partial<T>) {
    Object.assign(form, values)
  }

  /**
   * 获取表单值
   */
  function getValues(): T {
    return { ...form } as T
  }

  /**
   * 重置到初始值
   */
  function reset() {
    Object.assign(form, initialValues)
  }

  /**
   * 清除空值（删除 undefined、null、'' 的字段）
   */
  function getCleanValues(): Partial<T> {
    const result: Partial<T> = {}
    for (const [key, value] of Object.entries(form)) {
      if (value !== undefined && value !== null && value !== '') {
        result[key as keyof T] = value as T[keyof T]
      }
    }
    return result
  }

  return {
    form,
    ...toRefs(form),
    setValues,
    getValues,
    getCleanValues,
    reset
  }
}
