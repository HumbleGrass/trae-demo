import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TechButton from './TechButton.vue'

describe('TechButton', () => {
  it('renders with default props', () => {
    const wrapper = mount(TechButton, {
      slots: { default: 'Click me' }
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('emits click event', async () => {
    const wrapper = mount(TechButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(TechButton, {
      props: { disabled: true }
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('shows loading state when loading prop is true', () => {
    const wrapper = mount(TechButton, {
      props: { loading: true }
    })
    expect(wrapper.find('.el-icon-loading').exists()).toBe(true)
  })

  it('applies correct variant class', () => {
    const wrapper = mount(TechButton, {
      props: { variant: 'primary' }
    })
    expect(wrapper.classes()).toContain('tech-btn-primary')
  })
})
