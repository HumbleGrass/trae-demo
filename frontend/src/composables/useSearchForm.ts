/**
 * 搜索表单相关的 composable
 * @description 提供通用的搜索表单状态管理
 */
import { reactive } from 'vue'

/**
 * 创建搜索表单状态
 * @param initialValues - 初始值，缺省为空对象
 * @returns 搜索表单状态和方法
 */
export function useSearchForm<T extends Record<string, any>>(initialValues: T = {} as T) {
  // 始终保持同一 reactive 引用，避免调用方解构后丢失响应式
  const form = reactive<T>({ ...initialValues })

  /**
   * 设置表单值
   * @param values - 需要合并进表单的值
   */
  function setValues(values: Partial<T>) {
    Object.assign(form, values)
  }

  /**
   * 设置单个字段
   * @param key - 字段名
   * @param value - 字段值
   */
  function setField<K extends keyof T>(key: K, value: T[K]) {
    form[key] = value
  }

  /**
   * 获取表单值
   * @returns 表单值副本
   */
  function getValues(): T {
    return { ...form } as T
  }

  /**
   * 重置到初始值
   */
  function reset() {
    // 先移除当前表单中不属于初始值的字段，再恢复初始值
    for (const key of Object.keys(form)) {
      delete (form as Record<string, unknown>)[key]
    }
    Object.assign(form, initialValues)
  }

  /**
   * 清除空值（删除 undefined、null、'' 的字段）
   * @returns 去除空值后的表单值
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
    setValues,
    setField,
    getValues,
    getCleanValues,
    reset
  }
}
