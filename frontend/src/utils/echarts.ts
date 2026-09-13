/**
 * ECharts 按需引入统一入口
 *
 * 通过 echarts/core 只注册项目实际使用的图表类型与组件，
 * 替代全量 `import * as echarts from 'echarts'`，显著减小构建产物。
 * 新增图表类型（gauge/radar 等）或组件（dataZoom/toolbox 等）时需在此登记。
 */
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  CanvasRenderer,
])

export * from 'echarts/core'
// EChartsOption 组合类型只存在于完整包的类型定义中；
// type 导出在编译期被擦除，不产生任何运行时代码
export type { EChartsOption } from 'echarts'
