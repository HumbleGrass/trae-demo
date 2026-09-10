/**
 * ECharts Notion 浅色主题 — 颜色与 src/styles/_notion-values.scss 对齐
 *
 * 注意：本文件当前未被任何组件直接引用。
 * 实际主题注入由 components/Chart/index.vue 的 applyNotionTheme() 完成。
 * 本文件作为主题常量的参考来源和手动使用时的工具。
 */

import * as echarts from 'echarts'

export const notionChartColors = {
  textPrimary: '#000000',
  textSecondary: '#31302e',
  textMuted: '#615d59',
  textFaint: '#a39e98',
  axisLine: '#e6e6e6',
  axisLabel: '#615d59',
  splitLine: '#f6f5f4',
  primary: '#0075de',
  primaryActive: '#005bab',
  success: '#1a7f37',
  warning: '#9a6700',
  danger: '#cf222e',
  accentSky: '#62aef0',
  accentTeal: '#2a9d99',
  accentPurpleDeep: '#391c57',
  accentOrange: '#dd5b00'
}

export const notionPalette = [
  '#0075de', '#62aef0', '#2a9d99', '#1aae39', '#9a6700', '#cf222e',
  '#d6b6f6', '#ff64c8', '#dd5b00'
]

export const notionFontFamily = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'

/**
 * 获取折线图 Notion 风格配置
 */
export function getNotionLineSeries(data: number[], name?: string, color?: string) {
  const c = color || notionChartColors.primary
  return {
    name,
    data,
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: { color: c, width: 2.5 },
    itemStyle: { color: c, borderColor: '#fff', borderWidth: 2 },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: `rgba(0, 117, 222, 0.12)` },
        { offset: 1, color: 'rgba(0, 117, 222, 0.02)' }
      ])
    }
  }
}

/**
 * 获取柱状图 Notion 风格配置
 */
export function getNotionBarSeries(data: number[], name?: string, color?: string) {
  const c = color || notionChartColors.primary
  return {
    name,
    data,
    type: 'bar',
    barWidth: '50%',
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
      color: c
    }
  }
}

/**
 * 获取饼图 Notion 风格默认颜色序列
 */
export function getNotionPieColors() {
  return [
    notionChartColors.primary,
    notionChartColors.accentSky,
    notionChartColors.accentTeal,
    notionChartColors.success,
    notionChartColors.warning,
    notionChartColors.danger
  ]
}
