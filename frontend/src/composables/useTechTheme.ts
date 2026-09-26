/**
 * 科技主题相关的共享工具函数
 * @description 提供科技风格 UI 相关的颜色、渐变、动画等工具
 */

// 图书分类配色常量
export const BOOK_CATEGORY_COLORS: Record<string, string> = {
  '文学': 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)',
  '科技': 'linear-gradient(135deg, #00f5ff 0%, #0077b6 100%)',
  '历史': 'linear-gradient(135deg, #ffbe0b 0%, #fb5607 100%)',
  '儿童': 'linear-gradient(135deg, #3a86ff 0%, #8ac926 100%)',
  'default': 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)'
}

// 头像配色常量
export const AVATAR_GRADIENTS: string[] = [
  'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)',
  'linear-gradient(135deg, #00f5ff 0%, #0077b6 100%)',
  'linear-gradient(135deg, #ffbe0b 0%, #fb5607 100%)',
  'linear-gradient(135deg, #3a86ff 0%, #8ac926 100%)',
  'linear-gradient(135deg, #ef476f 0%, #7209b7 100%)'
]

/**
 * 获取图书封面渐变色
 * @param category - 图书分类
 * @returns CSS 渐变字符串
 */
export function getCoverColor(category?: string): string {
  return BOOK_CATEGORY_COLORS[category || ''] || BOOK_CATEGORY_COLORS['default']
}

/**
 * 获取头像渐变色
 * @param name - 用户名（用于哈希计算）
 * @returns CSS 渐变字符串
 */
export function getAvatarGradient(name?: string): string {
  const index = name ? name.charCodeAt(0) % AVATAR_GRADIENTS.length : 0
  return AVATAR_GRADIENTS[index]
}

/**
 * 科技主题相关的 composable
 */
export function useTechTheme() {
  return {
    getCoverColor,
    getAvatarGradient,
    BOOK_CATEGORY_COLORS,
    AVATAR_GRADIENTS
  }
}
