/**
 * ECharts 科技风格主题配置
 * @description 提供完整的深色科技风格 ECharts 主题
 */

export const techChartTheme = {
  backgroundColor: 'transparent',
  
  // 文字颜色
  textColor: '#e0e0ff',
  textSecondary: '#b0b0d0',
  textMuted: '#8080a0',
  
  // 颜色系统
  colors: [
    '#00f3ff', // 霓虹青蓝
    '#ff00ff', // 品红
    '#00ff88', // 霓虹绿
    '#ffaa00', // 琥珀黄
    '#ff3366', // 霓虹红
    '#0066ff', // 科技蓝
    '#beec5a', // 黄绿
    '#ff6b9d'  // 粉红
  ],
  
  // 系列配色
  seriesColors: [
    { type: 'line', color: '#00f3ff', areaColor: 'rgba(0, 243, 255, 0.15)' },
    { type: 'bar', color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: '#33e0ff' },
      { offset: 1, color: '#00c8d4' }
    ])},
    { type: 'pie', colors: ['#00f3ff', '#ff00ff', '#00ff88', '#ffaa00', '#ff3366'] }
  ]
}

/**
 * 获取通用的 ECharts 科技风格配置选项
 */
export function getTechChartOptions(): Record<string, any> {
  return {
    backgroundColor: 'transparent',
    
    // 标题样式
    title: {
      textStyle: {
        color: '#e0e0ff',
        fontFamily: 'Inter, sans-serif',
        fontSize: 16,
        fontWeight: 700,
        textShadowColor: '#00f3ff',
        textShadowBlur: 10
      }
    },
    
    // 图例样式
    legend: {
      textStyle: {
        color: '#b0b0d0',
        fontFamily: 'Inter, sans-serif'
      }
    },
    
    // 提示框样式
    tooltip: {
      backgroundColor: 'rgba(20, 20, 40, 0.95)',
      borderColor: 'rgba(0, 243, 255, 0.3)',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: {
        color: '#e0e0ff',
        fontFamily: 'Inter, sans-serif',
        fontSize: 13
      },
      extraCssText: 'box-shadow: 0 4px 20px rgba(0, 243, 255, 0.2); backdrop-filter: blur(10px);'
    },
    
    // 网格样式
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    
    // X轴样式
    xAxis: {
      axisLine: {
        lineStyle: { 
          color: 'rgba(0, 243, 255, 0.2)' 
        }
      },
      axisLabel: {
        color: '#8080a0',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12
      },
      splitLine: {
        lineStyle: { 
          color: 'rgba(0, 243, 255, 0.05)',
          type: 'dashed'
        }
      }
    },
    
    // Y轴样式
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#8080a0',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12
      },
      splitLine: {
        lineStyle: { 
          color: 'rgba(0, 243, 255, 0.1)',
          type: 'dashed'
        }
      }
    }
  }
}

/**
 * 获取折线图的科技风格系列配置
 */
export function getTechLineSeries(data: number[], name?: string): Record<string, any> {
  return {
    name,
    data,
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 8,
    lineStyle: {
      color: '#00f3ff',
      width: 3,
      shadowColor: '#00f3ff',
      shadowBlur: 10
    },
    itemStyle: {
      color: '#00f3ff',
      borderColor: '#fff',
      borderWidth: 2
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(0, 243, 255, 0.25)' },
        { offset: 1, color: 'rgba(0, 243, 255, 0.02)' }
      ])
    }
  }
}

/**
 * 获取柱状图的科技风格系列配置
 */
export function getTechBarSeries(data: number[], name?: string): Record<string, any> {
  return {
    name,
    data,
    type: 'bar',
    barWidth: '50%',
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#33e0ff' },
        { offset: 1, color: '#00c8d4' }
      ]),
      shadowColor: 'rgba(0, 243, 255, 0.4)',
      shadowBlur: 12
    }
  }
}

/**
 * 获取饼图的科技风格配置
 */
export function getTechPieOptions(data: Array<{value: number; name: string}>, title?: string): Record<string, any> {
  const baseOptions = getTechChartOptions()
  
  return {
    ...baseOptions,
    title: title ? { ...baseOptions.title, text: title } : undefined,
    tooltip: {
      ...baseOptions.tooltip,
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 20,
      top: 'center',
      textStyle: {
        color: '#b0b0d0',
        fontFamily: 'Inter, sans-serif'
      }
    },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#0a0a1a',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: 'Inter, sans-serif',
          color: '#00f3ff'
        }
      },
      data: data.length > 0 ? data : [{ value: 1, name: '暂无数据' }],
      color: ['#00f3ff', '#ff00ff', '#00ff88', '#ffaa00', '#ff3366']
    }]
  }
}
